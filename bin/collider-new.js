#!/usr/bin/env node

'use strict';

var pkg = require('../package.json')
var cli = require('commander');

var fs      = require('fs');
var path    = require('path');
var request = require('request');
var targz   = require('tar.gz');

cli
  .version( pkg.version )
  .arguments( '<project-name>' )
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

// var requestOpts = {
//   hostname: 'getcollider.com',
//   path:     '/latest.tar.gz',
// };

var colliderFile = {
  name: name,
  createdTime: Date.now(),
  matter: cli.matter
};

var colliderFileData = JSON.stringify( colliderFile );

// Create a new directory at 'newProjectPath'.
fs.mkdir( newProjectPath, function(error) {

  // Set a default error message.
  var errorMsg = `There was a problem creating "${name}" inside "${cwd}".`;

  if(error) {

    // Using the error code, make the default error message more useful.
    switch (error.code) {
      case 'EEXIST':
        errorMsg = `A file or directory named "${name}" already exists in "${cwd}".`;
        break;

      default:
    }

    // Log 'errorMsg' and exit.
    console.log(errorMsg);
    process.exit(1);

  } else {

    writeColliderFile( colliderFileData );
    getCollider();

    // To Do
    // get matter using `gulp matter` if the option was passed
    // and add @import 'matter/matter'; to main.scss.

  }

});

function writeColliderFile(data) {
  var colliderFilePath = path.join( newProjectPath, '.collider' );

  fs.writeFile( colliderFilePath, data, function(error) {
    if(error) throw error;
  });
}

function getCollider() {
  var read  = request.get('http://getcollider.com/latest.tar.gz');
  var write = targz({}, { strip: 1 }).createWriteStream( newProjectPath );

  read.pipe( write );
}
