// matter.js
//

'use strict';

var pkg = require('../package.json');

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

  collider: function (args) {
    args = args || [];
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

describe('collider', function () {

  it('should show a usage format when passed no args.', function () {
    var result = TempDir.collider();

    // TO DO:
    // Look into why exit code (1) is being
    // routed to STDOUT rather than STDERR.
    var text = result.stdout.toString();

    expect(text).to.contain('usage:');
    expect(text).to.not.contain('options:');
  });

  it('should show current version when passed "--version"', function () {
    var result = TempDir.collider(['--version']);
    var text   = result.stdout.toString();

    expect(text).to.contain(pkg.version);
  });

  it('should show help information when passed "--help"', function () {
    var result = TempDir.collider(['--help']);
    var text   = result.stdout.toString();

    expect(text).to.contain('options:');
    expect(text).to.contain('commands:');
  });

  it('should exit with an error when passed an undefined command', function () {
    var result = TempDir.collider(['undefined']);
    var text   = result.stderr.toString();

    expect(result.status).to.not.equal(0);
    expect(text).to.contain('Error:');
  });

  describe('run', function () {

    // it('should run an existing project', function () {

    // });
  });
});

after('clean', function () {
  TempDir.clean();
});
