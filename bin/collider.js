#!/usr/bin/env node

'use strict';

var pkg            = require('../package.json')
var yargs          = require('yargs');
var updateNotifier = require('update-notifier');

updateNotifier({ pkg }).notify();

yargs
  .strict()
  .version()
  .usage('collider [--version] [--help] <command> [<args>]')
  .command('run', 'Run an existing project in the current directory', require('../lib/commands/run'))
  .command('new <name>', 'Create a new project in the current directory', require('../lib/commands/new'))
  .help()
  .argv;

var command = yargs.argv._[0];

if(!command) {
  yargs.showHelp();
}
