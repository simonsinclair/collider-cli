#!/usr/bin/env node

'use strict';

var pkg            = require('../package.json')
var cli            = require('yargs');
var updateNotifier = require('update-notifier');

updateNotifier({ pkg }).notify();

cli
  .strict()
  .version()
  .usage('collider [--version] [--help] <command> [<args>]')
  .command('run', 'Run an existing project in the current directory', require('../lib/commands/run'))
  .command('new <name>', 'Create a new project in the current directory', require('../lib/commands/new'))
  .help()
  .argv;

var commands = cli.argv._;

// If no commands are given, then show help.
if(commands.length === 0) {
  cli.showHelp();
}
