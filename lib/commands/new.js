// new.js
//

'use strict';

var createError  = require('../createError');
var colliderfile = require('../colliderfile');
var download     = require('../download');
var extractTarGz = require('../extractTarGz');
var logErrorExit = require('../logErrorExit');
var pkg = require('../../package.json');

var fs   = require('fs');
var os   = require('os');
var path = require('path');

var docopt = require('docopt').docopt;

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

      var tmpArchive = path.join(os.tmpdir(), 'latest.tar.gz');

      download('http://getcollider.com/latest.tar.gz', tmpArchive, {
        headers: { 'User-Agent': `collider-cli/${pkg.version}`, },
        timeout: 10000,
      }, function () {

        console.log('Download complete. Extracting...');

        extractTarGz(tmpArchive, projectPath, function () {

          colliderfile.update({
            name: projectName,
            createdTime: Date.now(),
            author: author,
            matterLibs: [],
          }, projectPath, function () {
            console.log(`Extraction complete. Your new project is located at "${projectPath}".`);
            if (typeof cb === 'function') {
              cb();
            }
          });
        });
      });

    }

  });

};
