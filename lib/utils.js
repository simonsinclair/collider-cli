// utils.js
//

'use strict';

var fs = require('fs');

var chalk = require('chalk');

module.exports = {

  exists: function (path, cb) {
    fs.access(path, fs.F_OK, cb);
  },

  createError: function (msg, code) {
    var err  = new Error(msg);
    err.code = code;

    return err;
  },

  logErrorExit: function (err, exit) {
    console.error();
    console.error(chalk.red('Error:'), chalk.red(err.message));
    console.error();

    if (exit) {
      process.exit(1);
    }
  },

};
