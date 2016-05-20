// matter.js
//

'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var spawnSync = require('child_process').spawnSync;

var expect = require('chai').expect;
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var uuid = require('node-uuid');

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

  collider: function () {
    var args = Array.prototype.slice.call(arguments);
    return spawnSync('collider', args, { cwd: this.tmpLocation });
  },
};

// Set a unique temporary location.
TempDir.tmpLocation = path.join(os.tmpdir(), 'collider-cli-tests', uuid.v4());

// TESTS
//

before('prepare', function () {
  TempDir.prepare();
});

describe('collider-cli', function () {

  it('should return a usage string', function () {

  });

  describe('run', function () {

    it('should run an existing project', function () {

    });

    it('should throw an error when run from a non-existent project', function () {

    });
  });
});

after('clean', function () {
  TempDir.clean();
});
