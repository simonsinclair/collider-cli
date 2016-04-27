#!/usr/bin/env node

'use strict';

var pkg   = require('../package.json');

var docopt = require('docopt').docopt;
var updateNotifier = require('update-notifier');

updateNotifier({ pkg }).notify();

var doc = `
usage: collider [--version] [--help] <command> [<args>...]

options:
  -h, --help  Show this message.
  --version   Show program version.

The most commonly used collider commands are:
  run  Run the current project
  new  Create a new project in the current directory

See 'collider <command> --help' for more information on a specific command.

These collider commands are in the works:
  matter    Manage Matter libraries in the current project
  generate  Generate skeleton Matter within the current project
`;

var args = docopt(doc, {
  version: pkg.version,
  options_first: true
});

var cmd  = args['<command>'];
var argv = [cmd].concat(args['<args>']);

switch(cmd) {
  case 'run':
    require('../lib/commands/run')(argv);
    break;
  case 'new':
    require('../lib/commands/new')(argv);
    break;
  default:
    console.error(`"${cmd}" is not a collider command. See 'collider --help'.`)
}
