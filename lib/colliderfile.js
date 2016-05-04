// colliderfile.js
//

'use strict';

var fs = require('fs');

module.exports = {
  get: function (dir, cb) {
    fs.readFile(`${dir}/.collider`, cb);
  },

  getSync: function (dir) {
    return fs.readFileSync(`${dir}/.collider`, 'utf8');
  },

  existsIn: function (dir, cb) {
    fs.access(`${dir}/.collider`, fs.F_OK, cb);
  },

  /**
   * Write a .collider file
   * @param  {String} name   The name of a Collider project.
   * @param  {String} author The name of a project's author.
   * @param  {Array}  matter Objects describing Matter libs. name and locale.
   * @param  {String} path   The path to the directory to write to.
   */
  write: function (name, author, matter, dir) {
    var colliderfile = JSON.stringify({
      name: name,
      createdTime: Date.now(),
      author: author,
      matter: matter,
    });

    fs.writeFile(`${dir}/.collider`, colliderfile, function (err) {
      if (err) throw err;
    });
  },
};
