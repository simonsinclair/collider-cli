#!/usr/bin/env node

'use strict';

var pkg            = require('../package.json')
var yargs          = require('yargs');
var updateNotifier = require('update-notifier');

updateNotifier({ pkg }).notify();

// yargs
//   .strict()
//   .version()
//   .usage('$0 [--version] [--help] <command> [command] [<args>]')
//   .command('run', 'Run the current project', require('../lib/commands/run'))
//   .command('new <name>', 'Create a new project in the current directory', require('../lib/commands/new'))
//   .command('matter', 'Manage Matter libraries in the current project', function (yargs) {
//     return yargs
//       .command('clone <url> [locale]', 'Clone a Matter library into the current project', require('../lib/commands/matter/clone'))
//       .command('remove <locale>', 'Remove a Matter library from the current project', require('../lib/commands/matter/remove'));
//   })
//   .command('generate <type> <paths..>', 'Generate skeleton Matter within the current project', require('../lib/commands/generate'))
//   .command('status', 'Show information about the current project', require('../lib/commands/status'))
//   .help()
//   .argv;

// var command = yargs.argv._[0];

// if(!command) {
//   yargs.showHelp();
// }
