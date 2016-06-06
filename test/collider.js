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

    // To do:
    // Find a better way to run (mock) this test.
    it('should create a new project', function (cb) {
      this.timeout(10000);

      var filePath = __dirname + '/assets/latest.tar.gz';
      var contentLength = fs.statSync(filePath)['size'];

      var scope = nock('http://getcollider.com')
        .log(console.log)
        .get('/latest.tar.gz')
        .replyWithFile(200, filePath, {
          'Content-Length': contentLength
        });

      tempDir.runCmd('new', ['test-project'], tempDir.location, function () {
        expect(tempDir.exists('test-project/project/.collider')).to.be.true;
        cb();
      });
    });

    // Collider-file reference.
    // {"name":"","createdTime":0,"author":"","matterLibs":[]}

    it('should populate the Collider-file', function () {
      var project = tempDir.readJson('test-project/project/.collider');
      expect(project.name).to.deep.equal('test-project');
      expect(project.createdTime).to.be.above(0);
      expect(project.author).to.equal('unknown');
      expect(project.matterLibs).to.be.empty;
    });

    // To do:
    // Find a better way to run (mock) this test.
    it('should populate the Collider-file with the attributed author', function (cb) {
      this.timeout(10000);

      var filePath = __dirname + '/assets/latest.tar.gz';
      var contentLength = fs.statSync(filePath)['size'];

      var scope = nock('http://getcollider.com')
        .log(console.log)
        .get('/latest.tar.gz')
        .replyWithFile(200, filePath, {
          'Content-Length': contentLength
        });

      tempDir.runCmd('new', ['--author', 'Test Author', 'test-project-author'], tempDir.location, function () {
        var author = tempDir.readJson('test-project-author/project/.collider').author;
        expect(author).to.deep.equal('Test Author');
        cb();
      });
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
  this.timeout(10000);
  tempDir.clean();
});
