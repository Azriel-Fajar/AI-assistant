#!/usr/bin/env node
import { program } from 'commander';
import { google } from 'googleapis';
import chalk from 'chalk';
import { createWriteStream } from 'fs';
import { join } from 'path';
import * as readline from 'readline';
import { getAuthenticatedClient } from '../auth/oauth.js';
import { printTable, printJson, printSuccess, printInfo } from '../lib/output.js';
import { handleError } from '../lib/error.js';

async function getGmail() {
  const auth = await getAuthenticatedClient();
  return google.gmail({ version: 'v1', auth });
}

function decodeBody(payload) {
  const part = payload.parts?.find(p => p.mimeType === 'text/plain') || payload;
  if (part.body?.data) return Buffer.from(part.body.data, 'base64').toString('utf8');
  return '(no body)';
}

function getHeader(headers, name) {
  return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';
}

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => rl.question(question + ' (y/n) ', resolve));
  rl.close();
  return answer.toLowerCase() === 'y';
}

program.name('gmail').description('Gmail CLI');

program.command('list')
  .option('--unread', 'Show only unread')
  .option('--label <label>', 'Filter by label')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      let q = opts.unread ? 'is:unread' : '';
      if (opts.label) q += ` label:${opts.label}`;
      const res = await gm.users.messages.list({ userId: 'me', q: q.trim(), maxResults: 20 });
      const messages = res.data.messages || [];
      if (!messages.length) return console.log('No messages.');
      const details = await Promise.all(messages.map(m => gm.users.messages.get({ userId: 'me', id: m.id, format: 'metadata', metadataHeaders: ['From','Subject','Date'] })));
      const rows = details.map(d => ({ id: d.data.id, from: getHeader(d.data.payload.headers, 'From'), subject: getHeader(d.data.payload.headers, 'Subject'), date: getHeader(d.data.payload.headers, 'Date') }));
      if (opts.json) return printJson(rows);
      printTable(['ID', 'From', 'Subject', 'Date'], rows.map(r => [r.id.slice(0,8), r.from.slice(0,30), r.subject.slice(0,40), r.date]));
    } catch (e) { handleError(e); }
  });

program.command('read')
  .requiredOption('--id <messageId>', 'Message ID (first 8 chars ok)')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      const list = await gm.users.messages.list({ userId: 'me', maxResults: 50 });
      const msg = list.data.messages.find(m => m.id.startsWith(opts.id));
      if (!msg) return console.error('Message not found.');
      const res = await gm.users.messages.get({ userId: 'me', id: msg.id });
      const h = res.data.payload.headers;
      console.log(chalk.bold('From:'), getHeader(h, 'From'));
      console.log(chalk.bold('Subject:'), getHeader(h, 'Subject'));
      console.log(chalk.bold('Date:'), getHeader(h, 'Date'));
      console.log(chalk.gray('---'));
      console.log(decodeBody(res.data.payload));
    } catch (e) { handleError(e); }
  });

program.command('send')
  .requiredOption('--to <email>', 'Recipient email')
  .requiredOption('--subject <subject>', 'Subject')
  .requiredOption('--body <body>', 'Email body')
  .option('--yolo', 'Skip confirmation')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      if (!opts.yolo) {
        const ok = await confirm(`Send to ${opts.to} — "${opts.subject}"?`);
        if (!ok) return console.log('Cancelled.');
      }
      const raw = Buffer.from(`To: ${opts.to}\r\nSubject: ${opts.subject}\r\n\r\n${opts.body}`).toString('base64url');
      await gm.users.messages.send({ userId: 'me', resource: { raw } });
      printSuccess(`Sent to ${opts.to}`);
    } catch (e) {
      console.error(chalk.yellow('Send failed. Saving to drafts...'));
      try {
        const raw = Buffer.from(`To: ${opts.to}\r\nSubject: ${opts.subject}\r\n\r\n${opts.body}`).toString('base64url');
        const gm2 = await getGmail();
        await gm2.users.drafts.create({ userId: 'me', resource: { message: { raw } } });
        printInfo('Saved to drafts.');
      } catch (e2) { handleError(e2); }
    }
  });

program.command('reply')
  .requiredOption('--id <messageId>', 'Message ID to reply to')
  .requiredOption('--body <body>', 'Reply body')
  .option('--yolo', 'Skip confirmation')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      const list = await gm.users.messages.list({ userId: 'me', maxResults: 50 });
      const msg = list.data.messages.find(m => m.id.startsWith(opts.id));
      if (!msg) return console.error('Message not found.');
      const res = await gm.users.messages.get({ userId: 'me', id: msg.id });
      const h = res.data.payload.headers;
      const to = getHeader(h, 'From');
      const subject = 'Re: ' + getHeader(h, 'Subject');
      const threadId = res.data.threadId;
      if (!opts.yolo) {
        const ok = await confirm(`Reply to ${to}?`);
        if (!ok) return console.log('Cancelled.');
      }
      const raw = Buffer.from(`To: ${to}\r\nSubject: ${subject}\r\n\r\n${opts.body}`).toString('base64url');
      await gm.users.messages.send({ userId: 'me', resource: { raw, threadId } });
      printSuccess(`Reply sent to ${to}`);
    } catch (e) { handleError(e); }
  });

program.command('delete')
  .requiredOption('--id <messageId>', 'Message ID')
  .option('--yolo', 'Skip confirmation')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      const list = await gm.users.messages.list({ userId: 'me', maxResults: 50 });
      const msg = list.data.messages.find(m => m.id.startsWith(opts.id));
      if (!msg) return console.error('Message not found.');
      if (!opts.yolo) {
        const ok = await confirm(`Delete message ${opts.id}?`);
        if (!ok) return console.log('Cancelled.');
      }
      await gm.users.messages.trash({ userId: 'me', id: msg.id });
      printSuccess('Message moved to trash.');
    } catch (e) { handleError(e); }
  });

program.command('search')
  .requiredOption('--query <q>', 'Gmail search query')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      const res = await gm.users.messages.list({ userId: 'me', q: opts.query, maxResults: 20 });
      const messages = res.data.messages || [];
      if (!messages.length) return console.log('No messages found.');
      const details = await Promise.all(messages.map(m => gm.users.messages.get({ userId: 'me', id: m.id, format: 'metadata', metadataHeaders: ['From','Subject','Date'] })));
      const rows = details.map(d => ({ id: d.data.id, from: getHeader(d.data.payload.headers, 'From'), subject: getHeader(d.data.payload.headers, 'Subject') }));
      if (opts.json) return printJson(rows);
      printTable(['ID', 'From', 'Subject'], rows.map(r => [r.id.slice(0,8), r.from.slice(0,30), r.subject.slice(0,40)]));
    } catch (e) { handleError(e); }
  });

program.command('label')
  .option('--list', 'List all labels')
  .option('--add', 'Add label to message')
  .option('--id <messageId>', 'Message ID')
  .option('--name <label>', 'Label name')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      if (opts.list) {
        const res = await gm.users.labels.list({ userId: 'me' });
        const labels = res.data.labels || [];
        if (opts.json) return printJson(labels);
        printTable(['ID', 'Name', 'Type'], labels.map(l => [l.id, l.name, l.type]));
      } else if (opts.add) {
        const allLabels = await gm.users.labels.list({ userId: 'me' });
        let label = allLabels.data.labels.find(l => l.name.toLowerCase() === opts.name.toLowerCase());
        if (!label) {
          const created = await gm.users.labels.create({ userId: 'me', resource: { name: opts.name } });
          label = created.data;
        }
        const list = await gm.users.messages.list({ userId: 'me', maxResults: 50 });
        const msg = list.data.messages.find(m => m.id.startsWith(opts.id));
        if (!msg) return console.error('Message not found.');
        await gm.users.messages.modify({ userId: 'me', id: msg.id, resource: { addLabelIds: [label.id] } });
        printSuccess(`Label "${opts.name}" added.`);
      }
    } catch (e) { handleError(e); }
  });

program.command('drafts')
  .option('--list', 'List drafts')
  .option('--send <draftId>', 'Send a draft by ID')
  .option('--json', 'Output JSON')
  .option('--yolo', 'Skip confirmation for send')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      if (opts.list) {
        const res = await gm.users.drafts.list({ userId: 'me' });
        const drafts = res.data.drafts || [];
        if (opts.json) return printJson(drafts);
        printTable(['Draft ID', 'Message ID'], drafts.map(d => [d.id, d.message.id]));
      } else if (opts.send) {
        if (!opts.yolo) {
          const ok = await confirm(`Send draft ${opts.send}?`);
          if (!ok) return console.log('Cancelled.');
        }
        await gm.users.drafts.send({ userId: 'me', resource: { id: opts.send } });
        printSuccess('Draft sent.');
      }
    } catch (e) { handleError(e); }
  });

program.command('attachment')
  .option('--download', 'Download attachment')
  .option('--id <messageId>', 'Message ID')
  .option('--out <path>', 'Output path', '.')
  .action(async (opts) => {
    try {
      const gm = await getGmail();
      const list = await gm.users.messages.list({ userId: 'me', maxResults: 50 });
      const msg = list.data.messages.find(m => m.id.startsWith(opts.id));
      if (!msg) return console.error('Message not found.');
      const res = await gm.users.messages.get({ userId: 'me', id: msg.id });
      const parts = res.data.payload.parts?.filter(p => p.filename) || [];
      if (!parts.length) return console.log('No attachments found.');
      for (const part of parts) {
        const att = await gm.users.messages.attachments.get({ userId: 'me', messageId: msg.id, id: part.body.attachmentId });
        const data = Buffer.from(att.data.data, 'base64');
        const outPath = join(opts.out, part.filename);
        createWriteStream(outPath).write(data);
        printSuccess(`Downloaded: ${outPath}`);
      }
    } catch (e) { handleError(e); }
  });

program.parse();
