// run.js
//

'use strict';

var createError  = require('../createError');
var logErrorExit = require('../logErrorExit');

var fs    = require('fs');
var path  = require('path');
var spawn = require('child_process').spawn;

var cwd = process.cwd();
var colliderFile = path.join(cwd, 'project', '.collider');

// RUN
//

module.exports = {

  builder: {},

  handler: function(argv) {

    // If a Collider-file exists in the CWD, then spin up Collider.
    fs.access(colliderFile, fs.F_OK, function (err) {
      if (err) {
        var err = createError("a Collider-file couldn't be found. Is this a Collider project?");
        logErrorExit(err, true);
      } else {
        spawn('./node_modules/.bin/gulp', ['default'], { stdio: 'inherit' });
      }
    });

  },

};
