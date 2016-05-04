var chalk = require('chalk');

/**
 * Logs an error to console and optionally exits.
 *
 * @param  {Error}   err  An Error object
 * @param  {boolean} exit Whether to exit after logging
 */

function logErrorExit(err, exit) {

  // To do:
  // If err is not instance of Error, then throw

  console.error();
  console.error(chalk.red('Error:'), chalk.red(err.message));
  console.error();

  if (exit) {
    process.exit(1);
  }
}

module.exports = logErrorExit;
