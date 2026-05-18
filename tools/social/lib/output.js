import chalk from 'chalk';
import Table from 'cli-table3';

export function printTable(headers, rows) {
  const table = new Table({
    head: headers.map(h => chalk.cyan(h)),
    style: { head: [], border: [] },
  });
  rows.forEach(row => table.push(row));
  console.log(table.toString());
}

export function printJSON(data) {
  console.log(JSON.stringify(data, null, 2));
}

export function printSuccess(msg) {
  console.log(chalk.green('✓') + ' ' + msg);
}

export function printInfo(msg) {
  console.log(chalk.blue('i') + ' ' + msg);
}
