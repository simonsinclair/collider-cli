// matter.js
//

'use strict';

var pkg = require('../package.json');
var tempDir = require('./lib/TempDir');

var os = require('os');
var path = require('path');

var expect = require('chai').expect;
var nock = require('nock');
var uuid = require('node-uuid');

// Throw "NetConnectNotAllowedError" on any requests to 'un-Nocked' hosts.
nock.disableNetConnect();

// Set a unique temporary location.
tempDir.location = path.join(os.tmpdir(), 'collider-cli-tests', uuid.v4());

// TESTS
//

before('prepare', function () {
  tempDir.prepare();
});

describe('collider', function () {

  it('should show a usage format when passed no args.', function () {
    var result = tempDir.collider();

    // To do:
    // Look into why exit code (1) is being
    // routed to STDOUT rather than STDERR.
    var text = result.stdout.toString();

    expect(text).to.contain('usage:');
    expect(text).to.not.contain('options:');
  });

  it('should show current version when passed "--version"', function () {
    var result = tempDir.collider(['--version']);
    var text   = result.stdout.toString();

    expect(text).to.contain(pkg.version);
  });

  it('should show help information when passed "--help"', function () {
    var result = tempDir.collider(['--help']);
    var text   = result.stdout.toString();

    expect(text).to.contain('options:');
    expect(text).to.contain('commands:');
  });

  it('should exit with an error when passed an undefined command', function () {
    var result = tempDir.collider(['undefined']);
    var text   = result.stderr.toString();

    expect(result.status).to.not.equal(0);
    expect(text).to.contain('Error:');
  });

  // `new` command
  //

  describe('new', function () {

    it('should create a new project', function () {

    });

    // Collider-file reference.
    // {"name":"","createdTime":0,"author":"","matterLibs":[]}

    it('should populate the Collider-file', function () {

    });

    it('should populate the Collider-file with the attributed author', function () {

    });
  });

  // `run` command
  //

  describe('run', function () {

  });

  // `matter` command
  //

  describe('matter', function () {

  });

  // `generate` command
  //

  describe('generate', function () {

  });

  // `help` command
  //

  describe('help', function () {

  });
});

afterEach(function () {
  nock.cleanAll();
});

after('clean', function () {
  tempDir.clean();
});
