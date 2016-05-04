// run.js
//

'use strict';

var createError  = require('../createError');
var logErrorExit = require('../logErrorExit');
var colliderfile = require('../colliderfile');
var pkg = require('../../package.json');

var spawn = require('child_process').spawn;

var docopt = require('docopt').docopt;

// RUN
//

var doc = 'usage: collider run';

module.exports = function (argv) {

  var args = docopt(doc, {
    argv: argv,
    version: `Collider CLI ${pkg.version}`,
  });

  // If a Collider-file exists in the CWD, then spin up Collider.
  colliderfile.existsIn('./project', function (err) {
    if (err) {
      var err = createError('a Collider-file could not be found.');
      logErrorExit(err, true);
    }

    spawn('./node_modules/.bin/gulp', ['default'], { stdio: 'inherit' });
  });

};
