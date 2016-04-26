// new.js
//

'use strict';

var createError  = require('../createError');
var logErrorExit = require('../logErrorExit');

var fs      = require('fs');
var path    = require('path');
var request = require('request');
var tar     = require('tar-fs');
var zlib    = require('zlib');

var cwd = process.cwd();

// NEW
//

// module.exports = {

//   builder: function (yargs) {
//     return yargs.option('author', {
//       alias: 'a',
//       describe: 'Set a project author\'s name',
//       default: 'unknown',
//     });
//   },

//   handler: function (argv) {

//     var name = argv.name;

//     var newProjectPath = path.join(cwd, name);

//     var colliderFileData = {
//       name: name,
//       createdTime: Date.now(),
//       author: argv.author,
//     };

//     var colliderFile = JSON.stringify(colliderFileData);

//     // Create a new directory at 'newProjectPath'.
//     fs.mkdir(newProjectPath, function (err) {

//       // Set a default error message.
//       var errMsg = `There was a problem creating "${name}" inside of "${cwd}".`;

//       if (err) {

//         // Using the error code, make the default error message more useful.
//         switch (err.code) {
//           case 'EEXIST':
//             errMsg = `A file or directory named "${name}" already exists in "${cwd}".`;
//             break;

//           default:
//         }

//         var err = createError(errMsg);
//         logErrorExit(err, true);

//       } else {

//         getCollider(newProjectPath, function () {
//           writeColliderFile(colliderFile, newProjectPath);
//         });

//       }

//     });

//   },

// };

// FUNCTIONS
//

function writeColliderFile(data, destination) {
  var colliderFilePath = path.join(destination, 'project', '.collider');

  fs.writeFile(colliderFilePath, data, function(err) {
    if (err) {
      throw err;
    }
  });
}

function getCollider(destination, cb) {
  request('http://getcollider.com/latest.tar.gz', function(err) {
    if (!err) {
      cb();
    } else {
      throw err;
    }
  })
    .pipe(zlib.createGunzip())
    .pipe(tar.extract(destination));
}
