// test/lib/TempDir.js
//

var fs = require('fs');
var path = require('path');
var spawnSync = require('child_process').spawnSync;

var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

'use strict';

var TempDir = {
  tmpLocation: null,

  prepare: function () {
    mkdirp.sync(this.tmpLocation);
  },

  clean: function () {
    rimraf.sync(this.tmpLocation);
  },

  getPath: function (path) {
    return path.join(this.tmpLocation, path);
  },

  read: function (path) {
    return fs.readFileSync(this.getPath(path), 'utf8');
  },

  readJson: function (path) {
    return JSON.parse(this.read(path));
  },

  exists: function (path) {
    return fs.accessSync(path.join(this.tmpLocation, path), fs.F_OK);
  },

  collider: function (args, shouldInheritStdio) {
    args = args || [];
    return spawnSync('collider', args, { cwd: this.tmpLocation });
  },
};

module.exports = TempDir;
