// edit.js
//

'use strict';

var matter = require('../matter');
var utils  = require('../utils');

var _ = require('lodash');
var jsonfile = require('jsonfile');
var Queue    = require('queue');
var rimraf   = require('rimraf');

module.exports = function (settings) {

  var project = {};
  var updatedProject = {};

  var q = new Queue({ concurrency: 1 });

  // 1. Read current project.
  q.push(function (cb) {
    jsonfile.readFile('./collider.json', function (err, _project) {
      project = _project;
      cb(err);
    });
  });

  // 2. Populate 'updatedProject' with old and merge changed settings.
  q.push(function (cb) {
    _.assign(updatedProject, project, settings);
    cb(null);
  });

  // 3. Clean removed Matter libs.
  q.push(function (cb) {
    var removedMatterLibs = _.difference(project.matterLibs, updatedProject.matterLibs);
    var numJobs = removedMatterLibs.length;

    if (numJobs === 0) {
      return cb(null);
    }

    var numCompleteJobs = 0;

    removedMatterLibs.forEach(function (lib) {
      matter.clean(lib, function (err) {
        if (err) cb(err);

        numCompleteJobs++;
        if (numCompleteJobs === numJobs) cb(null);
      });
    });

  });

  // 4. Update collider/_matter.scss.
  q.push(function (cb) {
    matter.updateImports(updatedProject, cb);
  });

  // 5. Write updated collider.json.
  q.push(function (cb) {
    jsonfile.writeFile('./collider.json', updatedProject, { spaces: 2 }, cb);
  });

  // Go.
  q.start(function (err) {
    if (err) throw err;
  });

};
