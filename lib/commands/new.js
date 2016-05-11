// new.js
//

'use strict';

var createError  = require('../createError');
var colliderfile = require('../colliderfile');
var logErrorExit = require('../logErrorExit');
var pkg = require('../../package.json');

var fs      = require('fs');
var got     = require('got');
var path    = require('path');
var tar     = require('tar-fs');
var zlib    = require('zlib');

var docopt = require('docopt').docopt;

var cwd = process.cwd();

// NEW
//

var doc = `
usage:
  collider new [--author <author-name>] <project-name>

options:
  --author <author-name>  Set an author name [default: unknown].
`;

module.exports = function (argv) {

  var args = docopt(doc, {
    argv: argv,
    version: `Collider CLI ${pkg.version}`,
  });

  var projectName = args['<project-name>'];
  var author      = args['--author'];

  var projectPath = path.join(cwd, projectName);

  // Create a new directory at 'projectPath'.
  fs.mkdir(projectPath, function (err) {

    // Set a default error message.
    var errMsg = `there was a problem creating "${projectName}" inside of "${cwd}".`;

    if (err) {

      // Using the error code, make the default error message more useful.
      switch (err.code) {
        case 'EEXIST':
          errMsg = `a file or directory named "${projectName}" already exists in "${cwd}".`;
          break;

        default:
      }

      var err = createError(errMsg);
      logErrorExit(err, true);

    } else {

      getCollider(projectPath, function () {
        colliderfile.update({
          name: projectName,
          createdTime: Date.now(),
          author: author,
          matterLibs: [],
        }, projectPath);
      });

    }

  });

};

// FUNCTIONS
//

function getCollider(destination, cb) {
  got
    .stream('http://getcollider.com/latest.tar.gz')
      .on('error', function (err) {
        if (err) throw err;
      })
    .pipe(zlib.createGunzip())
    .pipe(tar.extract(destination))
      .on('finish', function () {
        if (typeof cb === 'function') {
          cb();
        }
      });
}
