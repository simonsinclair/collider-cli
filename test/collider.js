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

nock.disableNetConnect();

// Set a unique temporary location.
tempDir.tmpLocation = path.join(os.tmpdir(), 'collider-cli-tests', uuid.v4());

// TESTS
//

before('prepare', function () {
  tempDir.prepare();
});

describe('collider', function () {

  it('should show a usage format when passed no args.', function () {
    var result = tempDir.collider();

    // TO DO:
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

      // Intercept following HTTP request with a mocked
      // response and expected successful file payload.
      nock('http://getcollider.com')
        .get('/latest.tar.gz')
        .replyWithFile(200, 'assets/latest.tar.gz');

      tempDir.runCmd('new', ['test-project'], function () {
        var project = tempDir.readJson('test-project/project/.collider');

        expect(project.name).to.equal('test-project');
        expect(project.author).to.equal('unknown');
      });
    });

    it('should create a new project with an attributed author', function () {

      // Intercept following HTTP request with a mocked
      // response and expected successful file payload.
      nock('http://getcollider.com')
        .get('/latest.tar.gz')
        .replyWithFile(200, 'assets/latest.tar.gz');

      tempDir.runCmd('new', ['--author', 'Test Author', 'test-project-author'], function () {
        var project = tempDir.readJson('test-project-author/project/.collider');

        expect(project.name).to.equal('test-project-author');
        expect(project.author).to.equal('Test Author');
      });
    });
  });
});

afterEach(function () {
  nock.cleanAll();
});

after('clean', function () {
  tempDir.clean();
});
