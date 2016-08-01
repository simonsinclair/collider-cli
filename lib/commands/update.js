// update.js
//

'use strict';

var matter = require('../matter');
var pkg    = require('../../package.json');
var utils  = require('../utils');

var os   = require('os');
var path = require('path');

var jsonfile = require('jsonfile');
var Queue    = require('queue');
var rimraf   = require('rimraf');

module.exports = function (user) {

  if (!user.update) {
    console.log();
    console.log('Update cancelled. No changes have been made.');
    console.log();
    return;
  }

  var project    = {};
  var tmpArchive = path.join(os.tmpdir(), 'latest.tar.gz');

  var cleanGlobs = [
    'collider/',
    'distribute/',
    'node_modules/',
    'gulpfile.js',
    'package.json',
    '.editorconfig',
  ];

  var ignoreGlobs = [
    'project/',
  ];

  var q = new Queue({ concurrency: 1 });

  // 1. Ensure this is a Collider by populating 'project'.
  q.push(function (cb) {
    jsonfile.readFile('./collider.json', function (err, _project) {
      if (err) cb(err);
      project = _project;
      cb(null);
    });
  });

  // 2. Clean current Collider install.
  q.push(function (cb) {
    var numJobs = cleanGlobs.length;
    var numJobsCompleted = 0;

    cleanGlobs.forEach(function (pattern) {
      rimraf(pattern, {}, function (err) {
        if (err) cb(err);

        numJobsCompleted++;
        if (numJobsCompleted === numJobs) {
          cb(null);
        }
      });
    });
  });

  // 3. Download latest Collider.
  q.push(function (cb) {
    utils.download('http://getcollider.com/latest.tar.gz', tmpArchive, {
      headers: { 'User-Agent': `collider-cli/${pkg.version}`, },
      timeout: 10000,
    }, cb);
  });

  // 4. Expand latest Collider into project.
  q.push(function (cb) {
    utils.extractTarGz(tmpArchive, '.', ignoreGlobs, cb);
  });

  // 5. Rebuild '_matter.scss'.
  q.push(function (cb) {
    matter.updateImports(project, cb);
  });

  q.start(function (err) {
    if (err) throw err;
    console.log();
    console.log('All dependencies have been updated successfully.');
    console.log();
    console.log(project);
  });

};
