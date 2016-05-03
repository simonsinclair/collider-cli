// run.js
//

'use strict';

var createError  = require('../createError');
var logErrorExit = require('../logErrorExit');
var pkg = require('../../package.json');

var fs    = require('fs');
var path  = require('path');
var spawn = require('child_process').spawn;

var docopt = require('docopt').docopt;

var cwd = process.cwd();
var colliderFile = path.join(cwd, 'project', '.collider');

// RUN
//

var doc = 'usage: collider run';

module.exports = function (argv) {

  var args = docopt(doc, {
    argv: argv,
    version: `Collider CLI ${pkg.version}`,
  });

  // If a Collider-file exists in the CWD, then spin up Collider.
  fs.access(colliderFile, fs.F_OK, function (err) {
    if (err) {
      var err = createError("a Collider-file could not be found.");
      logErrorExit(err, true);
    } else {
      spawn('./node_modules/.bin/gulp', ['default'], { stdio: 'inherit' });
    }
  });

};
