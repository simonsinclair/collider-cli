// help.js
//

'use strict';

var createError = require('../createError');
var commands = require('../commands');
var logErrorExit = require('../logErrorExit');
var pkg = require('../../package.json');

var exec = require('child_process').exec;

var docopt = require('docopt').docopt;

// HELP
//

var doc = 'usage: collider help [<command>]';

module.exports = function (argv) {

  var args = docopt(doc, {
    argv: argv,
    version: `Collider CLI ${pkg.version}`,
  });

  var cmd = args['<command>'];

  // If a command was passed, then request its --help,
  // otherwise just request collider's --help.
  if (cmd) {
    cmd = `${cmd} --help`;
  } else {
    cmd = '--help';
  }

  exec(`collider ${cmd}`, {}, function (err, stdout, stderr) {
    if (!err) {
      console.log(stdout.trim());
    } else {
      var err = createError(stderr.trim());
      logErrorExit(err, true);
    }
  });
};
