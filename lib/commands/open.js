// open.js
//

'use strict';

var collider = require('../collider');
var matter   = require('../matter');
var pkg      = require('../../package.json');
var utils    = require('../utils');

var spawn = require('child_process').spawn;

var Queue = require('queue');

module.exports = function (project) {

  // To do: Validate 'project'.
  project = project || {};

  var q = new Queue({ concurrency: 1 });

  var missingMatterLibs = [];

  // 1. Meet Collider dependencies.
  q.push(function (cb) {
    var deps = collider.deps;
    var numMissingDeps = 0;

    var numJobs = deps.length;
    var numJobsCompleted = 0;

    deps.forEach(function (dep) {
      utils.exists(`./${dep}`, function (err) {
        if (err) {
          numMissingDeps++;
        }

        numJobsCompleted++;
        if (numJobsCompleted === numJobs) {
          finish();
        }
      });
    });

    function finish() {
      if (numMissingDeps > 0) {
        collider.update('.', cb);
      } else {
        cb(null);
      }
    }
  });

  // 2. Note any missing Matter lib. dependencies.
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

  // 3. Satisfy any missing Matter lib. dependencies.
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

  // 4. (Re)build collider/_matter.scss
  q.push(function (cb) {
    matter.updateImports(project.matterLibs, cb);
  });

  // Go.
  q.start(function (err) {
    if (err) throw err;
    spawn('./node_modules/.bin/gulp', ['default'], { stdio: 'inherit' });
  });

};
