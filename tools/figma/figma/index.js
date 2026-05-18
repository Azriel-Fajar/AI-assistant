#!/usr/bin/env node
import { program } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import fs from 'fs';
import { storeToken, retrieveToken, validateToken } from '../auth/token.js';
import { printTable, printJSON, printSuccess } from '../lib/output.js';
import { handleError, notAuthenticated, fileNotFound, noConnection, badFormat } from '../lib/error.js';

const FIGMA_API = 'https://api.figma.com/v1';

async function getHeaders() {
  const token = retrieveToken();
  if (!token) notAuthenticated();
  try {
    await validateToken(token);
  } catch {
    notAuthenticated();
  }
  return { 'X-Figma-Token': token };
}

function isNetworkError(err) {
  return err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT';
}

program.name('figma').description('Figma CLI for JARVIS');

// ---- auth ----
program
  .command('auth')
  .description('Store your Figma Personal Access Token')
  .requiredOption('--token <pat>', 'Figma Personal Access Token')
  .action(async (opts) => {
    try {
      await validateToken(opts.token);
      storeToken(opts.token);
      console.log(chalk.green('✓') + ' Token saved.');
    } catch (err) {
      if (isNetworkError(err)) noConnection();
      console.error(chalk.red('Invalid token. Check your PAT and try again.'));
      process.exit(1);
    }
  });

// ---- files ----
program
  .command('files')
  .description('List Figma files (requires --team)')
  .option('--team <teamId>', 'Figma team ID')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      if (!opts.team) {
        console.error(chalk.yellow('Provide a team ID: figma files --team <team-id>'));
        console.error(chalk.yellow('Find your team ID in the Figma URL: figma.com/files/team/<team-id>/...'));
        process.exit(1);
      }
      const headers = await getHeaders();
      const projectsRes = await axios.get(`${FIGMA_API}/teams/${opts.team}/projects`, { headers });
      const projects = projectsRes.data.projects || [];
      const allFiles = [];
      for (const project of projects) {
        const filesRes = await axios.get(`${FIGMA_API}/projects/${project.id}/files`, { headers });
        const files = (filesRes.data.files || []).map(f => ({ ...f, project: project.name }));
        allFiles.push(...files);
      }
      if (opts.debug || opts.json) return printJSON(allFiles);
      if (!allFiles.length) return console.log('No files found.');
      printTable(
        ['Key', 'Name', 'Project', 'Last Modified'],
        allFiles.map(f => [
          f.key,
          f.name,
          f.project,
          new Date(f.last_modified).toLocaleDateString('en-ID'),
        ])
      );
    } catch (err) {
      if (isNetworkError(err)) noConnection();
      if (err?.response?.status === 404) fileNotFound(opts.team);
      handleError(err, opts.debug);
    }
  });

// ---- export ----
program
  .command('export <fileId>')
  .description('Export assets from a Figma file')
  .option('--node <nodeId>', 'Node ID to export')
  .option('--format <fmt>', 'Export format: png, svg, or pdf', 'png')
  .option('--out <path>', 'Output file path', './export')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (fileId, opts) => {
    const VALID_FORMATS = ['png', 'svg', 'pdf'];
    if (!VALID_FORMATS.includes(opts.format)) return badFormat();
    try {
      const headers = await getHeaders();
      const nodeParam = opts.node ? opts.node : '0:1';
      const url = `${FIGMA_API}/images/${fileId}?ids=${nodeParam}&format=${opts.format}&scale=2`;
      const res = await axios.get(url, { headers });
      if (opts.debug || opts.json) return printJSON(res.data);
      const images = res.data.images || {};
      const entries = Object.entries(images);
      if (!entries.length) return console.log('No images returned.');
      for (const [nodeId, imgUrl] of entries) {
        if (!imgUrl) { console.error(`Node ${nodeId}: export failed (Figma returned null)`); continue; }
        const outPath = entries.length === 1
          ? `${opts.out}.${opts.format}`
          : `${opts.out}-${nodeId.replace(':', '-')}.${opts.format}`;
        const imgRes = await axios.get(imgUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(outPath, Buffer.from(imgRes.data));
        printSuccess(`Exported: ${outPath}`);
      }
    } catch (err) {
      if (isNetworkError(err)) noConnection();
      if (err?.response?.status === 404) fileNotFound(fileId);
      handleError(err, opts.debug);
    }
  });

// ---- inspect ----
program
  .command('inspect <fileId>')
  .description('Print design properties (colors, fonts, spacing) for a node')
  .option('--node <nodeId>', 'Node ID to inspect', '0:1')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (fileId, opts) => {
    try {
      const headers = await getHeaders();
      const res = await axios.get(`${FIGMA_API}/files/${fileId}/nodes?ids=${opts.node}`, { headers });
      const nodes = res.data.nodes || {};
      const nodeData = nodes[opts.node];
      if (!nodeData) return fileNotFound(`${fileId}#${opts.node}`);
      const doc = nodeData.document;
      if (opts.debug || opts.json) return printJSON(doc);

      const fills = (doc.fills || []).filter(f => f.type === 'SOLID');
      const colors = fills.map(f => {
        const { r, g, b, a } = f.color;
        const toHex = v => Math.round(v * 255).toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}` + (a < 1 ? ` (opacity: ${(f.opacity ?? a).toFixed(2)})` : '');
      });

      const style = doc.style || {};
      const fontInfo = style.fontFamily
        ? `${style.fontFamily} ${style.fontWeight ?? ''} ${style.fontSize ?? ''}px / ${style.lineHeightPx ?? '?'}px`
        : 'none';

      const bbox = doc.absoluteBoundingBox || {};
      const size = bbox.width ? `${bbox.width}x${bbox.height}` : 'N/A';

      printTable(
        ['Property', 'Value'],
        [
          ['Name', doc.name || ''],
          ['Type', doc.type || ''],
          ['Size', size],
          ['Colors', colors.length ? colors.join(', ') : 'none'],
          ['Font', fontInfo],
        ]
      );
    } catch (err) {
      if (isNetworkError(err)) noConnection();
      if (err?.response?.status === 404) fileNotFound(fileId);
      handleError(err, opts.debug);
    }
  });

// ---- download ----
program
  .command('download <fileId>')
  .description('Download full Figma file JSON to disk')
  .requiredOption('--out <path>', 'Output file path (e.g. ./mobile-app.json)')
  .option('--debug', 'Show raw API response')
  .action(async (fileId, opts) => {
    try {
      const headers = await getHeaders();
      const res = await axios.get(`${FIGMA_API}/files/${fileId}`, { headers });
      if (opts.debug) return printJSON(res.data);
      const outPath = opts.out.endsWith('.json') ? opts.out : `${opts.out}.json`;
      fs.writeFileSync(outPath, JSON.stringify(res.data, null, 2), 'utf8');
      printSuccess(`Downloaded: ${outPath} (file: "${res.data.name}")`);
    } catch (err) {
      if (isNetworkError(err)) noConnection();
      if (err?.response?.status === 404) fileNotFound(fileId);
      handleError(err, opts.debug);
    }
  });

// ---- comments ----
const comments = program.command('comments').description('Manage file comments');

comments
  .command('list <fileId>')
  .description('List comments on a Figma file')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (fileId, opts) => {
    try {
      const headers = await getHeaders();
      const res = await axios.get(`${FIGMA_API}/files/${fileId}/comments`, { headers });
      const items = res.data.comments || [];
      if (opts.debug || opts.json) return printJSON(items);
      if (!items.length) return console.log('No comments.');
      printTable(
        ['ID', 'Author', 'Message', 'Date'],
        items.map(c => [
          c.id,
          c.user?.handle || '?',
          c.message.slice(0, 60) + (c.message.length > 60 ? '...' : ''),
          new Date(c.created_at).toLocaleDateString('en-ID'),
        ])
      );
    } catch (err) {
      if (isNetworkError(err)) noConnection();
      if (err?.response?.status === 404) fileNotFound(fileId);
      handleError(err, opts.debug);
    }
  });

comments
  .command('add <fileId>')
  .description('Add a comment to a Figma file')
  .requiredOption('--message <msg>', 'Comment text')
  .option('--debug', 'Show raw API response')
  .action(async (fileId, opts) => {
    try {
      const headers = await getHeaders();
      const res = await axios.post(
        `${FIGMA_API}/files/${fileId}/comments`,
        { message: opts.message },
        { headers }
      );
      if (opts.debug) return printJSON(res.data);
      printSuccess(`Comment added: ${res.data.id}`);
    } catch (err) {
      if (isNetworkError(err)) noConnection();
      if (err?.response?.status === 404) fileNotFound(fileId);
      handleError(err, opts.debug);
    }
  });

// ---- versions ----
program
  .command('versions <fileId>')
  .description('List version history of a Figma file')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (fileId, opts) => {
    try {
      const headers = await getHeaders();
      const res = await axios.get(`${FIGMA_API}/files/${fileId}/versions`, { headers });
      const versions = res.data.versions || [];
      if (opts.debug || opts.json) return printJSON(versions);
      if (!versions.length) return console.log('No versions found.');
      printTable(
        ['ID', 'Label', 'Author', 'Date', 'Description'],
        versions.map(v => [
          v.id,
          v.label || '(auto)',
          v.user?.handle || '?',
          new Date(v.created_at).toLocaleDateString('en-ID'),
          (v.description || '').slice(0, 40),
        ])
      );
    } catch (err) {
      if (isNetworkError(err)) noConnection();
      if (err?.response?.status === 404) fileNotFound(fileId);
      handleError(err, opts.debug);
    }
  });

program.parse();
