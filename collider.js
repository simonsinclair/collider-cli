#!/usr/bin/env node

'use strict';

var pkg            = require('./package.json')
var cli            = require('commander');
var updateNotifier = require('update-notifier');

updateNotifier({ pkg }).notify();

cli
  .version( pkg.version )
  .command( 'new <dir>', 'creates a new project in a directory' )
  .command( 'run', 'runs an existing project in the current directory', { isDefault: true } )
  .parse( process.argv );
