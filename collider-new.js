#!/usr/bin/env node

'use strict';

var pkg = require('./package.json')
var cli = require('commander');

var fs   = require('fs');
var path = require('path');

cli
  .version( pkg.version )
  .arguments( '<dir>' )
  .option('-p, --product', 'also include given product\'s Matter')
  .parse( process.argv );

// If no args were passed, exit with help.
if( ! cli.args.length ) {
  cli.help()
}


// Begin
//

var cwd = process.cwd();
var dir = cli.args[0];

var newProjectPath = path.join( cwd, dir );

// Create a new directory at 'newProjectPath'.
fs.mkdir( newProjectPath, function(error) {

  // Set a catch-all error message.
  var errorMsg = `There was a problem creating "${dir}" inside "${cwd}".`;

  if(error) {

    // If we have an error code, then make the error message more useful.
    switch (error.code) {
      case 'EEXIST':
        errorMsg = `A directory named "${dir}" already exists in "${cwd}".`;
        break;

      default:
    }

    // Log 'errorMsg' and exit.
    console.log(errorMsg);
    process.exit(1);

  } else {
    getCollider();
  }

});

function getCollider() {
  console.log('Getting Collider...');
}
