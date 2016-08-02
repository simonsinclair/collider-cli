// matter.js
//

'use strict';

var pkg = require('../package.json');
var tempDir = require('./lib/TempDir');

var fs = require('fs');
var os = require('os');
var path = require('path');

var expect = require('chai').expect;
var nock = require('nock');
var uuid = require('node-uuid');

// Disable all 'un-Nocked' requests.
nock.disableNetConnect();

// Set a unique temporary location.
tempDir.location = path.join(os.tmpdir(), 'collider-cli-tests', uuid.v4());

// TESTS
//

before('prepare', function () {
  tempDir.prepare();
});

describe('collider', function () {

  it('should show current version when passed "--version"', function () {

  });

  it('should show help information when passed "--help"', function () {

  });

  // `new` command
  //

  describe('new', function () {

  });

  // `edit` command
  //

  describe('edit', function () {

  });

  // `open` command
  //

  describe('open', function () {

  });

  // `generate` command
  //

  describe('generate', function () {

  });

  // `update` command
  //

  describe('update', function () {

  });
});

afterEach(function () {
  nock.cleanAll();
});

after('clean', function () {
  tempDir.clean();
});
