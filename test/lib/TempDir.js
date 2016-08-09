// test/lib/TempDir.js
//

'use strict';

var cmds = require('../../lib/commands');

var fs   = require('fs');
var os   = require('os');
var path = require('path');

var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var uuid   = require('uuid');

var tmpLocation = path.join(
  os.tmpdir(),
  'collider-tests',
  uuid.v4().slice(0, 8)
);

after(function () {
  rimraf.sync(tmpLocation);
});

function TempDir() {
  this.path = path.join(tmpLocation, uuid.v4());
}

TempDir.prototype.prepare = function (files) {
  rimraf.sync(this.path);
  mkdirp.sync(this.path);

  return this;
};

TempDir.prototype.getPath = function (name) {
  return path.join(this.path, name);
};

TempDir.prototype.read = function (name) {
  return fs.readFileSync(this.getPath(name), 'utf8');
};

TempDir.prototype.readJson = function (name) {
  return JSON.parse(this.read(name));
};

TempDir.prototype.exists = function (name) {
  return fs.accessSync(path.join(this.path, name), fs.F_OK);
};

module.exports = TempDir;
