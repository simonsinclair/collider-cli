// new.js
//

'use strict';

var createError  = require('../createError');
var colliderfile = require('../colliderfile');
var logErrorExit = require('../logErrorExit');
var pkg = require('../../package.json');

var fs   = require('fs');
var path = require('path');
var tar  = require('tar-fs');
var zlib = require('zlib');

var docopt = require('docopt').docopt;
var ProgressBar = require('progress');
var request = require('request');

// NEW
//

var doc = `
usage:
  collider new [--author <author-name>] <project-name>

options:
  --author <author-name>  Set an author name [default: unknown].
`;

module.exports = function (argv, dir, cb) {

  var args = docopt(doc, {
    argv: argv,
    version: `Collider CLI ${pkg.version}`,
  });

  var projectName = args['<project-name>'];
  var author      = args['--author'];

  var projectPath = path.join(dir, projectName);

  // Create a new directory at 'projectPath'.
  fs.mkdir(projectPath, function (err) {

    // Set a default error message.
    var errMsg = `there was a problem creating "${projectName}" inside of "${dir}".`;

    if (err) {

      // Using the error code, make the default error message more useful.
      switch (err.code) {
        case 'EEXIST':
          errMsg = `a file or directory named "${projectName}" already exists in "${dir}".`;
          break;

        default:
      }

      var err = createError(errMsg);
      logErrorExit(err, true);

    } else {

      downloadCollider(projectPath, function () {
        colliderfile.update({
          name: projectName,
          createdTime: Date.now(),
          author: author,
          matterLibs: [],
        }, projectPath, function () {
          if (typeof cb === 'function') {
            cb();
          }
        });
      });

    }

  });

};

function downloadCollider(destination, cb) {

  // Stream the request for the latest Collider archive.
  request('http://getcollider.com/latest.tar.gz', {
    headers: { 'User-Agent': `collider-cli/${pkg.version}`, },
    timeout: 10000,
  })
    .on('response', function (response) {

      // Only create and bind events to a progress bar if we're within a TTY context.
      // - Prevents "TypeError: this.stream.clearLine is not a function" etc. in testing.
      if (process.stdout.isTTY) {
        var contentLength = Number(response.headers['content-length']);
        var progressBar = new ProgressBar('Downloading [:bar] :percent ETA :etas ', {
          total: contentLength,
          incomplete: ' ',
          clear: true,
        });

        // Response events.
        //

        response.on('data', function (chunk) {
          progressBar.tick(chunk.length);
        });
      }

      response.on('error', function (err) {
        throw err;
      });
    })

    // request 'error'
    .on('error', function (err) {
      throw err;
    })

  // Gunzip.
  .pipe(zlib.createGunzip())
    .on('error', function (err) {
      throw err;
    })

  // Untar to 'destination'.
  .pipe(tar.extract(destination))
    .on('error', function (err) {
      throw err;
    })
    .on('finish', function () {
      console.log(`Download complete. Your new project is located at "${destination}".`);
      if (typeof cb === 'function') {
        cb();
      }
    });
}
