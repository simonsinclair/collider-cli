// matter.js
//

'use strict';

var pkg = require('../package.json');
var TempDir = require('./lib/TempDir');

var os = require('os');
var path = require('path');

var expect = require('chai').expect;
var uuid = require('node-uuid');

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
  this.timeout(0);
  TempDir.clean();
});
