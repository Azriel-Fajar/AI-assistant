import chalk from 'chalk';

export function handleError(err, debug = false) {
  if (debug) {
    console.error(chalk.red('ERROR:'), err);
  } else {
    const msg = err?.errors?.[0]?.message || err?.message || String(err);
    console.error(chalk.red('Error:'), msg);
  }
  process.exit(1);
}

export function notAuthenticated() {
  console.error(chalk.yellow('Not authenticated.'), 'Run: yt auth (or gcal auth)');
  process.exit(1);
}
