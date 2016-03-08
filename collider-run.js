#!/usr/bin/env node

'use strict';

var pkg = require('./package.json')
var cli = require('commander');

cli
  .version( pkg.version )
  .parse( process.argv );

// console.log( cli );
