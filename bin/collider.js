#!/usr/bin/env node

'use strict';

var pkg            = require('../package.json')
var cli            = require('commander');
var updateNotifier = require('update-notifier');

updateNotifier({ pkg }).notify();

cli
  .version( pkg.version )
  .command( 'run', 'runs an existing project in the current directory', { isDefault: true } )
  .command( 'new <project-name>', 'creates a new project in the current directory' )
  .parse( process.argv );
