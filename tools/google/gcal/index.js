#!/usr/bin/env node
import { program } from 'commander';
import { google } from 'googleapis';
import chalk from 'chalk';
import * as readline from 'readline';
import { getAuthenticatedClient, runAuthFlow } from '../auth/oauth.js';
import { printTable, printJson, printSuccess } from '../lib/output.js';
import { handleError } from '../lib/error.js';

async function getCalendar() {
  const auth = await getAuthenticatedClient();
  return google.calendar({ version: 'v3', auth });
}

function formatDateTime(dt) {
  if (!dt) return '';
  const d = new Date(dt.dateTime || dt.date);
  return d.toLocaleString('en-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' });
}

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => rl.question(question + ' (y/n) ', resolve));
  rl.close();
  return answer.toLowerCase() === 'y';
}

program.name('gcal').description('Google Calendar CLI');

program.command('auth').description('Authenticate with Google').action(async () => {
  try { await runAuthFlow(); } catch (e) { handleError(e); }
});

program.command('list')
  .description('List events')
  .option('--date <date>', 'today, week, or YYYY-MM-DD', 'today')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const cal = await getCalendar();
      const now = new Date();
      let timeMin = new Date(now.setHours(0,0,0,0)).toISOString();
      let timeMax;
      if (opts.date === 'today') {
        timeMax = new Date(new Date().setHours(23,59,59,999)).toISOString();
      } else if (opts.date === 'week') {
        const end = new Date(); end.setDate(end.getDate() + 7);
        timeMax = end.toISOString();
      } else {
        const d = new Date(opts.date);
        timeMin = new Date(d.setHours(0,0,0,0)).toISOString();
        timeMax = new Date(d.setHours(23,59,59,999)).toISOString();
      }
      const res = await cal.events.list({ calendarId: 'primary', timeMin, timeMax, singleEvents: true, orderBy: 'startTime' });
      const events = res.data.items || [];
      if (opts.json) return printJson(events);
      if (!events.length) return console.log('No events found.');
      printTable(['ID', 'Title', 'Start', 'End'],
        events.map(e => [e.id.slice(0,8), e.summary || '(no title)', formatDateTime(e.start), formatDateTime(e.end)]));
    } catch (e) { handleError(e, opts.debug); }
  });

program.command('add')
  .description('Add an event')
  .requiredOption('--title <title>', 'Event title')
  .requiredOption('--date <date>', 'Date (YYYY-MM-DD or "today"/"tomorrow")')
  .requiredOption('--time <time>', 'Start time (HH:MM)')
  .option('--duration <minutes>', 'Duration in minutes', '60')
  .option('--attendees <emails>', 'Comma-separated emails')
  .action(async (opts) => {
    try {
      const cal = await getCalendar();
      let date = opts.date;
      if (date === 'today') date = new Date().toISOString().split('T')[0];
      if (date === 'tomorrow') { const d = new Date(); d.setDate(d.getDate()+1); date = d.toISOString().split('T')[0]; }
      const start = new Date(`${date}T${opts.time}:00`);
      const end = new Date(start.getTime() + parseInt(opts.duration) * 60000);
      const attendees = opts.attendees ? opts.attendees.split(',').map(e => ({ email: e.trim() })) : [];
      const event = { summary: opts.title, start: { dateTime: start.toISOString(), timeZone: 'Asia/Jakarta' }, end: { dateTime: end.toISOString(), timeZone: 'Asia/Jakarta' }, attendees };
      const res = await cal.events.insert({ calendarId: 'primary', resource: event });
      printSuccess(`Created: "${opts.title}" on ${opts.date} at ${opts.time}`);
    } catch (e) { handleError(e); }
  });

program.command('update')
  .description('Update an event')
  .requiredOption('--id <eventId>', 'Event ID (first 8 chars ok)')
  .option('--title <title>')
  .option('--date <date>')
  .option('--time <time>')
  .action(async (opts) => {
    try {
      const cal = await getCalendar();
      const list = await cal.events.list({ calendarId: 'primary', maxResults: 100, singleEvents: true });
      const event = list.data.items.find(e => e.id.startsWith(opts.id));
      if (!event) return console.error('Event not found.');
      if (opts.title) event.summary = opts.title;
      if (opts.date || opts.time) {
        const currentStart = new Date(event.start.dateTime);
        const date = opts.date || currentStart.toISOString().split('T')[0];
        const time = opts.time || currentStart.toTimeString().slice(0,5);
        const newStart = new Date(`${date}T${time}:00`);
        const duration = new Date(event.end.dateTime) - currentStart;
        event.start.dateTime = newStart.toISOString();
        event.end.dateTime = new Date(newStart.getTime() + duration).toISOString();
      }
      await cal.events.update({ calendarId: 'primary', eventId: event.id, resource: event });
      printSuccess(`Updated: "${event.summary}"`);
    } catch (e) { handleError(e); }
  });

program.command('delete')
  .description('Delete an event')
  .requiredOption('--id <eventId>', 'Event ID (first 8 chars ok)')
  .option('--yolo', 'Skip confirmation')
  .action(async (opts) => {
    try {
      const cal = await getCalendar();
      const list = await cal.events.list({ calendarId: 'primary', maxResults: 100, singleEvents: true });
      const event = list.data.items.find(e => e.id.startsWith(opts.id));
      if (!event) return console.error('Event not found.');
      if (!opts.yolo) {
        const ok = await confirm(`Delete "${event.summary}"?`);
        if (!ok) return console.log('Cancelled.');
      }
      await cal.events.delete({ calendarId: 'primary', eventId: event.id });
      printSuccess(`Deleted: "${event.summary}"`);
    } catch (e) { handleError(e); }
  });

program.command('search')
  .description('Search events')
  .requiredOption('--query <q>', 'Search query')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const cal = await getCalendar();
      const res = await cal.events.list({ calendarId: 'primary', q: opts.query, singleEvents: true, maxResults: 20 });
      const events = res.data.items || [];
      if (opts.json) return printJson(events);
      if (!events.length) return console.log('No events found.');
      printTable(['ID', 'Title', 'Start'], events.map(e => [e.id.slice(0,8), e.summary || '(no title)', formatDateTime(e.start)]));
    } catch (e) { handleError(e); }
  });

program.command('remind')
  .description('Add a reminder to an event')
  .requiredOption('--id <eventId>', 'Event ID')
  .requiredOption('--before <minutes>', 'Minutes before event')
  .action(async (opts) => {
    try {
      const cal = await getCalendar();
      const list = await cal.events.list({ calendarId: 'primary', maxResults: 100, singleEvents: true });
      const event = list.data.items.find(e => e.id.startsWith(opts.id));
      if (!event) return console.error('Event not found.');
      event.reminders = { useDefault: false, overrides: [{ method: 'popup', minutes: parseInt(opts.before) }] };
      await cal.events.update({ calendarId: 'primary', eventId: event.id, resource: event });
      printSuccess(`Reminder set: ${opts.before} min before "${event.summary}"`);
    } catch (e) { handleError(e); }
  });

program.command('recurring')
  .description('List or add recurring events')
  .option('--list', 'List recurring events')
  .option('--add', 'Add recurring event')
  .option('--title <title>')
  .option('--freq <freq>', 'daily, weekly, or monthly')
  .option('--time <time>', 'HH:MM')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const cal = await getCalendar();
      if (opts.list) {
        const res = await cal.events.list({ calendarId: 'primary', maxResults: 50, singleEvents: false });
        const events = (res.data.items || []).filter(e => e.recurrence);
        if (opts.json) return printJson(events);
        printTable(['ID', 'Title', 'Recurrence'], events.map(e => [e.id.slice(0,8), e.summary, e.recurrence[0]]));
      } else if (opts.add) {
        const freqMap = { daily: 'DAILY', weekly: 'WEEKLY', monthly: 'MONTHLY' };
        const today = new Date().toISOString().split('T')[0];
        const start = new Date(`${today}T${opts.time}:00`);
        const end = new Date(start.getTime() + 3600000);
        const event = {
          summary: opts.title,
          start: { dateTime: start.toISOString(), timeZone: 'Asia/Jakarta' },
          end: { dateTime: end.toISOString(), timeZone: 'Asia/Jakarta' },
          recurrence: [`RRULE:FREQ=${freqMap[opts.freq]}`],
        };
        await cal.events.insert({ calendarId: 'primary', resource: event });
        printSuccess(`Recurring event created: "${opts.title}" (${opts.freq})`);
      }
    } catch (e) { handleError(e); }
  });

program.parse();
