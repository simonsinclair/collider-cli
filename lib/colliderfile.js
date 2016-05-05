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

      cb(JSON.parse(data));
    });
  },

  getSync: function (projectPath) {
    return fs.readFileSync(`${projectPath}/project/.collider`, 'utf8');
  },

  exists: function (projectPath, cb) {
    fs.access(`${projectPath}/project/.collider`, fs.F_OK, cb);
  },

  /**
   * Write a .collider file.
   * @param  {String} projectName The name of a Collider project.
   * @param  {String} createdTime The time a project was created.
   * @param  {String} author      The name of a project's author.
   * @param  {Array}  matter      An array of objects describing Matter libs.
   * @param  {String} projectPath The path to a project.
   */
  update: function (projectName, createdTime, author, matter, projectPath) {
    var colliderfile = JSON.stringify({
      name: projectName,
      createdTime: createdTime,
      author: author,
      matter: matter,
    });

    fs.writeFile(`${projectPath}/project/.collider`, colliderfile, function (err) {
      if (err) throw err;
    });
  },
};
