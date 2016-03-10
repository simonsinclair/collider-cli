#!/usr/bin/env node

'use strict';

var pkg = require('../package.json')
var cli = require('commander');

var fs    = require('fs');
var path  = require('path');
var spawn = require('child_process').spawn;

cli
  .version( pkg.version )
  .parse( process.argv );

var cwd = process.cwd();
var colliderFile = path.join( cwd, '.collider');

// Check if a Collider-file exists in the current working directory before running Gulp.
fs.access( colliderFile, fs.F_OK, function(error) {
  if(error) {
    console.log('A Collider-file could not be found in this directory.');
  } else {
    spawn('./node_modules/.bin/gulp', ['default'], { stdio: 'inherit' });
  }
});
