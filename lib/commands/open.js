// open.js
//

'use strict';

var matter = require('../matter');
var pkg    = require('../../package.json');
var utils  = require('../utils');

var spawn = require('child_process').spawn;

var Queue = require('queue');

module.exports = function (project) {

  // To do: Validate 'project'.
  project = project || {};

  var q = new Queue({ concurrency: 1 });

  var missingMatterLibs = [];

  // 1. Check for missing Matter lib. dependencies.
  q.push(function (cb) {
    var matterLibs = project.matterLibs;

    var numJobs          = matterLibs.length;
    var numJobsCompleted = 0;

    if (numJobs === 0) {
      cb(null);
    }

    matterLibs.forEach(function (lib) {
      var locale = matter.getLocale(lib);

      utils.exists(`./${locale}`, function (err) {
        if (err) {
          missingMatterLibs.push(lib);
        }

        numJobsCompleted++;
        if (numJobsCompleted === numJobs) {
          cb(null);
        }
      });
    });
  });

  // 2. Satisfy any missing Matter lib. dependencies.
  q.push(function (cb) {
    var numJobs          = missingMatterLibs.length;
    var numJobsCompleted = 0;

    if (numJobs === 0) {
      cb(null);
    }

    missingMatterLibs.forEach(function (lib) {

      matter.clone(lib, function (err) {
        if (err) cb(err);

        numJobsCompleted++;
        if (numJobsCompleted === numJobs) {
          cb(null);
        }
      });

    });
  });

  // Go.
  q.start(function (err) {
    if (err) throw err;
    spawn('./node_modules/.bin/gulp', ['default'], { stdio: 'inherit' });
  });

};
