import chalk from 'chalk';

export function handleError(err, debug = false) {
  if (debug) {
    console.error(chalk.red('ERROR:'), err);
  } else {
    const msg = err?.response?.data?.error?.message
      || err?.response?.data?.message
      || err?.message
      || String(err);
    console.error(chalk.red('Error:'), msg);
  }
  process.exit(1);
}

export function notAuthenticated(platform = 'ig') {
  console.error(chalk.yellow(`Not authenticated. Run: ${platform} auth`));
  process.exit(1);
}
