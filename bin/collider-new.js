#!/usr/bin/env node

'use strict';

var pkg = require('../package.json')
var cli = require('commander');

var createError  = require('../lib/createError');
var logErrorExit = require('../lib/logErrorExit');

var fs      = require('fs');
var path    = require('path');
var request = require('request');
var tar     = require('tar-fs');
var zlib    = require('zlib');

cli
  .version( pkg.version )
  .arguments( '<project-name>' )
  .option('-a, --author <full name>', 'set a project author')
  .option('-m, --matter <url>', 'include a Matter repository from a clone URL')
  .parse( process.argv );

// If no args were passed, exit with help.
if( ! cli.args.length ) {
  cli.help();
}


// Begin
//

var cwd  = process.cwd();
var name = cli.args[0];

var newProjectPath = path.join( cwd, name );

var colliderFile = {
  name: name,
  createdTime: Date.now(),
  author: typeof cli.author !== 'undefined' ? cli.author : "",
  matter: typeof cli.matter !== 'undefined' ? cli.matter : ""
};

var colliderFileData = JSON.stringify( colliderFile );

// Create a new directory at 'newProjectPath'.
fs.mkdir( newProjectPath, function(err) {

  // Set a default error message.
  var errMsg = `There was a problem creating "${name}" inside "${cwd}".`;

  if(err) {

    // Using the error code, make the default error message more useful.
    switch (err.code) {
      case 'EEXIST':
        errMsg = `A file or directory named "${name}" already exists in "${cwd}".`;
        break;

      default:
    }

    var err = createError( errMsg );
    logErrorExit( err, true );

  } else {

    getCollider(function() {
      writeColliderFile( colliderFileData );
    });

    // To Do:
    // - Get Matter using `gulp matter` if option was passed
    // - Add "@import 'matter/matter';" to "main.scss"

  }

});

function writeColliderFile(data) {
  var colliderFilePath = path.join( newProjectPath, 'project', '.collider' );

  fs.writeFile( colliderFilePath, data, function(err) {
    if (err) {
      throw err;
    }
  });
}

function getCollider(cb) {
  request('http://getcollider.com/latest.tar.gz', function(err) {
    if ( ! err ) {
      cb();
    } else {
      throw err;
    }
  })
    .pipe( zlib.createGunzip() )
    .pipe( tar.extract( newProjectPath ) );
}
