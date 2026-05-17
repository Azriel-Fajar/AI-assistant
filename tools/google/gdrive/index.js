#!/usr/bin/env node
import { program } from 'commander';
import { google } from 'googleapis';
import chalk from 'chalk';
import { createReadStream, createWriteStream } from 'fs';
import { basename } from 'path';
import * as readline from 'readline';
import { getAuthenticatedClient } from '../auth/oauth.js';
import { printTable, printJson, printSuccess } from '../lib/output.js';
import { handleError } from '../lib/error.js';

async function getDrive() {
  const auth = await getAuthenticatedClient();
  return google.drive({ version: 'v3', auth });
}

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => rl.question(question + ' (y/n) ', resolve));
  rl.close();
  return answer.toLowerCase() === 'y';
}

async function findFileId(drive, nameOrId) {
  if (nameOrId.length > 20 && !nameOrId.includes(' ')) return nameOrId;
  const res = await drive.files.list({ q: `name contains '${nameOrId}' and trashed=false`, fields: 'files(id,name)', pageSize: 5 });
  const files = res.data.files || [];
  if (!files.length) throw new Error(`File not found: ${nameOrId}`);
  return files[0].id;
}

program.name('gdrive').description('Google Drive CLI');

program.command('list')
  .option('--folder <name>', 'Filter by folder name')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      let q = 'trashed=false';
      if (opts.folder) {
        const folderRes = await drive.files.list({ q: `name='${opts.folder}' and mimeType='application/vnd.google-apps.folder'`, fields: 'files(id)' });
        const folder = folderRes.data.files?.[0];
        if (!folder) return console.error(`Folder not found: ${opts.folder}`);
        q += ` and '${folder.id}' in parents`;
      }
      const res = await drive.files.list({ q, fields: 'files(id,name,mimeType,size,modifiedTime)', pageSize: 30 });
      const files = res.data.files || [];
      if (opts.json) return printJson(files);
      if (!files.length) return console.log('No files found.');
      printTable(['ID', 'Name', 'Type', 'Modified'], files.map(f => [f.id.slice(0,8), f.name, f.mimeType.split('.').pop(), f.modifiedTime?.slice(0,10)]));
    } catch (e) { handleError(e); }
  });

program.command('upload')
  .requiredOption('--file <localPath>', 'Local file path')
  .option('--to <folder>', 'Destination folder name')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const metadata = { name: basename(opts.file) };
      if (opts.to) {
        const folderRes = await drive.files.list({ q: `name='${opts.to}' and mimeType='application/vnd.google-apps.folder'`, fields: 'files(id)' });
        const folder = folderRes.data.files?.[0];
        if (!folder) return console.error(`Folder not found: ${opts.to}`);
        metadata.parents = [folder.id];
      }
      await drive.files.create({ resource: metadata, media: { body: createReadStream(opts.file) }, fields: 'id' });
      printSuccess(`Uploaded: ${basename(opts.file)}${opts.to ? ' → ' + opts.to : ''}`);
    } catch (e) { handleError(e); }
  });

program.command('download')
  .requiredOption('--file <nameOrId>', 'File name or ID')
  .option('--out <path>', 'Output directory', '.')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const fileId = await findFileId(drive, opts.file);
      const meta = await drive.files.get({ fileId, fields: 'name' });
      const dest = `${opts.out}/${meta.data.name}`;
      const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
      await new Promise((resolve, reject) => {
        const writer = createWriteStream(dest);
        res.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      printSuccess(`Downloaded: ${dest}`);
    } catch (e) { handleError(e); }
  });

program.command('delete')
  .requiredOption('--file <nameOrId>', 'File name or ID')
  .option('--yolo', 'Skip confirmation')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const fileId = await findFileId(drive, opts.file);
      if (!opts.yolo) {
        const ok = await confirm(`Delete "${opts.file}"?`);
        if (!ok) return console.log('Cancelled.');
      }
      await drive.files.delete({ fileId });
      printSuccess(`Deleted: ${opts.file}`);
    } catch (e) { handleError(e); }
  });

program.command('search')
  .requiredOption('--query <q>', 'Search query')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const res = await drive.files.list({ q: `name contains '${opts.query}' and trashed=false`, fields: 'files(id,name,mimeType,modifiedTime)', pageSize: 20 });
      const files = res.data.files || [];
      if (opts.json) return printJson(files);
      if (!files.length) return console.log('No files found.');
      printTable(['ID', 'Name', 'Modified'], files.map(f => [f.id.slice(0,8), f.name, f.modifiedTime?.slice(0,10)]));
    } catch (e) { handleError(e); }
  });

program.command('share')
  .requiredOption('--file <nameOrId>', 'File name or ID')
  .requiredOption('--with <email>', 'Email to share with')
  .option('--role <role>', 'viewer, editor, or commenter', 'viewer')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const fileId = await findFileId(drive, opts.file);
      await drive.permissions.create({ fileId, resource: { type: 'user', role: opts.role, emailAddress: opts.with } });
      printSuccess(`Shared "${opts.file}" with ${opts.with} as ${opts.role}`);
    } catch (e) { handleError(e); }
  });

program.command('move')
  .requiredOption('--file <nameOrId>', 'File name or ID')
  .requiredOption('--to <folder>', 'Destination folder name')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const fileId = await findFileId(drive, opts.file);
      const meta = await drive.files.get({ fileId, fields: 'parents' });
      const folderRes = await drive.files.list({ q: `name='${opts.to}' and mimeType='application/vnd.google-apps.folder'`, fields: 'files(id)' });
      const folder = folderRes.data.files?.[0];
      if (!folder) return console.error(`Folder not found: ${opts.to}`);
      await drive.files.update({ fileId, addParents: folder.id, removeParents: meta.data.parents.join(','), fields: 'id,parents' });
      printSuccess(`Moved "${opts.file}" to "${opts.to}"`);
    } catch (e) { handleError(e); }
  });

program.command('copy')
  .requiredOption('--file <nameOrId>', 'File name or ID')
  .option('--to <folder>', 'Destination folder name')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const fileId = await findFileId(drive, opts.file);
      const copyMeta = {};
      if (opts.to) {
        const folderRes = await drive.files.list({ q: `name='${opts.to}' and mimeType='application/vnd.google-apps.folder'`, fields: 'files(id)' });
        const folder = folderRes.data.files?.[0];
        if (!folder) return console.error(`Folder not found: ${opts.to}`);
        copyMeta.parents = [folder.id];
      }
      const res = await drive.files.copy({ fileId, resource: copyMeta, fields: 'id,name' });
      printSuccess(`Copied to: ${res.data.name}`);
    } catch (e) { handleError(e); }
  });

program.command('permissions')
  .option('--list', 'List permissions')
  .option('--remove', 'Remove a permission')
  .option('--file <nameOrId>', 'File name or ID')
  .option('--user <email>', 'User email to remove')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const drive = await getDrive();
      const fileId = await findFileId(drive, opts.file);
      if (opts.list) {
        const res = await drive.permissions.list({ fileId, fields: 'permissions(id,emailAddress,role,type)' });
        const perms = res.data.permissions || [];
        if (opts.json) return printJson(perms);
        printTable(['ID', 'Email', 'Role'], perms.map(p => [p.id, p.emailAddress || p.type, p.role]));
      } else if (opts.remove) {
        const res = await drive.permissions.list({ fileId, fields: 'permissions(id,emailAddress)' });
        const perm = res.data.permissions.find(p => p.emailAddress === opts.user);
        if (!perm) return console.error(`Permission not found for ${opts.user}`);
        await drive.permissions.delete({ fileId, permissionId: perm.id });
        printSuccess(`Removed access for ${opts.user}`);
      }
    } catch (e) { handleError(e); }
  });

program.parse();
