#!/usr/bin/env node

'use strict';

var pkg            = require('./package.json')
var cli            = require('commander');
var updateNotifier = require('update-notifier');

updateNotifier({ pkg }).notify();

cli
  .version( pkg.version )
  .parse( process.argv );
