#!/usr/bin/env node

'use strict';

var cli = require('../lib/cli');
var pkg = require('../package.json');

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
  },
});

var updateNotifier = require('update-notifier');

updateNotifier({ pkg }).notify();

cli(argv);
