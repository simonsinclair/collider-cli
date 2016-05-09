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
   * @param  {Object}   data        An object containing name, createdTime, author and matterLibs.
   * @param  {String}   projectPath The path to the project containing a .collider file.
   * @param  {Function} cb          A function to call on success.
   */
  update: function (data, projectPath, cb) {
    var colliderfile = JSON.stringify({
      name: data.name,
      createdTime: data.createdTime,
      author: data.author,
      matterLibs: data.matterLibs,
    });

    fs.writeFile(`${projectPath}/project/.collider`, colliderfile, function (err) {
      if (err) throw err;
      if (typeof cb === 'function') {
        cb();
      }
    });
  },
};
