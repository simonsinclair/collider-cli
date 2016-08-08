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

  // 1. Install 'node_modules' if they don't exist.
  q.push(function (cb) {
    utils.exists(`./node_modules`, function (err) {
      if (err) {
        var npmInstall = spawn('npm', ['i'], { stdio: 'inherit' });

        npmInstall.on('close', function (code) {
          if (code !== 0) {
            var npmInstallErr = utils.createError('Error installing NPM packages.');
            return cb(npmInstallErr);
          }
          cb(null);
        });

      } else {
        cb(null)
      }
    });
  });

  // 2. Check for missing Matter lib. dependencies.
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
