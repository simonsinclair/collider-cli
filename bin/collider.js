#!/usr/bin/env node

'use strict';

var createError  = require('../lib/createError');
var logErrorExit = require('../lib/logErrorExit');
var pkg = require('../package.json');

var cmdRun      = require('../lib/commands/run');
var cmdNew      = require('../lib/commands/new');
var cmdMatter   = require('../lib/commands/matter');
var cmdGenerate = require('../lib/commands/generate');
var cmdHelp     = require('../lib/commands/help');

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

switch (cmd) {
  case 'run':
    cmdRun(argv);
    break;
  case 'new':
    cNew(argv);
    break;
  case 'matter':
    cmdMatter(argv);
    break;
  case 'generate':
    cmdGenerate(argv);
    break;
  case 'help':
    cmdHelp(argv);
    break;
  default:
    console.error(`collider: "${cmd}" is not a collider command. See 'collider --help'.`);
}
