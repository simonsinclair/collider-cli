#!/usr/bin/env node

'use strict';

var createError  = require('../lib/createError');
var logErrorExit = require('../lib/logErrorExit');
var pkg = require('../package.json');

var cmds = require('../lib/commands');

var docopt = require('docopt').docopt;
var updateNotifier = require('update-notifier');

updateNotifier({ pkg }).notify();

var doc = `
usage: collider [--version] [--help] <command> [<args>...]

options:
  -h, --help  Show help information.
  --version   Show program version.

commands:
  new       Create a new project in the current directory.
  run       Run the current project.
  matter    Manage Matter libraries in the current project.
  generate  Generate skeleton Matter within the current project.
  help      Show help information.

See 'collider help <command>' for more information on a specific command.
`;

var args = docopt(doc, {
  version: `Collider CLI ${pkg.version}`,
  options_first: true,
});

var cmd  = args['<command>'];
var argv = [cmd].concat(args['<args>']);

if (typeof cmds[cmd] !== 'undefined') {
  cmds[cmd](argv, process.cwd());
} else {
  var err = createError(`"${cmd}" is not a collider command. See 'collider help'.`);
  logErrorExit(err, true);
}
