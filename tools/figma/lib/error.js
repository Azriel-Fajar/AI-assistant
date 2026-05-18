import chalk from 'chalk';

export function handleError(err, debug = false) {
  if (debug) {
    console.error(chalk.red('ERROR:'), err);
  } else {
    const msg = err?.response?.data?.err || err?.message || String(err);
    console.error(chalk.red('Error:'), msg);
  }
  process.exit(1);
}

export function notAuthenticated() {
  console.error(chalk.yellow('Invalid or expired token. Run: figma auth --token <pat>'));
  process.exit(1);
}

export function fileNotFound(fileId) {
  console.error(chalk.red(`File not found: ${fileId}`));
  process.exit(1);
}

export function noConnection() {
  console.error(chalk.red('No connection. Check network.'));
  process.exit(1);
}

export function badFormat() {
  console.error(chalk.red('Format must be png, svg, or pdf'));
  process.exit(1);
}
