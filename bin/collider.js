#!/usr/bin/env node

'use strict';

var createError  = require('../lib/createError');
var logErrorExit = require('../lib/logErrorExit');
var pkg = require('../package.json');

var docopt = require('docopt').docopt;
var updateNotifier = require('update-notifier');

updateNotifier({ pkg }).notify();

var doc = `
usage: collider [--version] [--help] <command> [<args>...]

options:
  -h, --help  Show help information.
  --version   Show program version.

commands:
  run       Run the current project.
  new       Create a new project in the current directory.
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

switch(cmd) {
  case 'run':
    require('../lib/commands/run')(argv);
    break;
  case 'new':
    require('../lib/commands/new')(argv);
    break;
  case 'matter':
    require('../lib/commands/matter')(argv);
    break;
  case 'generate':
    require('../lib/commands/generate')(argv);
    break;
  case 'help':
    require('../lib/commands/help')(argv);
    break;
  default:
    console.error(`collider: "${cmd}" is not a collider command. See 'collider --help'.`)
}
