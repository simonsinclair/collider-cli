// test/lib/TempDir.js
//

'use strict';

var cmds = require('../../lib/commands');

var fs = require('fs');
var path = require('path');

var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var TempDir = {
  location: null,

  prepare: function () {
    mkdirp.sync(this.location);
  },

  clean: function () {
    rimraf.sync(this.location);
  },

  getPath: function (name) {
    return path.join(this.location, name);
  },

  read: function (name) {
    return fs.readFileSync(this.getPath(name), 'utf8');
  },

  readJson: function (name) {
    return JSON.parse(this.read(name));
  },

  exists: function (name) {
    return fs.accessSync(path.join(this.location, name), fs.F_OK) ? false : true;
  },

};

module.exports = TempDir;
