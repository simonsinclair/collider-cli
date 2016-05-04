// colliderfile.js
//

'use strict';

var createError  = require('./createError');
var logErrorExit = require('./logErrorExit');

var fs = require('fs');

module.exports = {
  get: function (projectPath, cb) {
    fs.readFile(`${projectPath}/project/.collider`, function (err, data) {
      var errMsg = 'the Collider-file could not be read.';
      if (err) {
        switch (err.code) {
          case 'ENOENT':
            errMsg = 'a Collider-file could not be found.';
            break;
          default:
        }
        var err = createError(errMsg);
        logErrorExit(err, true);
      }

      cb(data);
    });
  },

  getSync: function (projectPath) {
    return fs.readFileSync(`${projectPath}/project/.collider`, 'utf8');
  },

  exists: function (projectPath, cb) {
    fs.access(`${projectPath}/project/.collider`, fs.F_OK, cb);
  },

  /**
   * Write a .collider file
   * @param  {String} name   The name of a Collider project.
   * @param  {String} author The name of a project's author.
   * @param  {Array}  matter Objects describing Matter libs. name and locale.
   * @param  {String} path   The path to the directory to write to.
   */
  write: function (name, author, matter, projectPath) {
    var colliderfile = JSON.stringify({
      name: name,
      createdTime: Date.now(),
      author: author,
      matter: matter,
    });

    fs.writeFile(`${projectPath}/project/.collider`, colliderfile, function (err) {
      if (err) throw err;
    });
  },
};
