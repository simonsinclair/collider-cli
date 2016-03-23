#!/usr/bin/env node

'use strict';

var pkg = require('../package.json')
var cli = require('commander');

var createError  = require('../lib/createError');
var logErrorExit = require('../lib/logErrorExit');

var fs    = require('fs');
var path  = require('path');
var spawn = require('child_process').spawn;

cli
  .version( pkg.version )
  .parse( process.argv );

var cwd = process.cwd();
var colliderFile = path.join( cwd, 'project', '.collider');

// Check if a Collider-file exists in the current working directory before running Gulp.
fs.access( colliderFile, fs.F_OK, function(err) {
  if(err) {
    var err = createError("a Collider-file couldn't be found. Is this a Collider project?");
    logErrorExit( err, true );
  } else {
    spawn('./node_modules/.bin/gulp', ['default'], { stdio: 'inherit' });
  }
});
