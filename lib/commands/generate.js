// generate.js
//

'use strict';

var pkg   = require('../../package.json');
var utils = require('../utils');

var fs = require('fs');

var mkdirp = require('mkdirp');
var Queue = require('queue');

module.exports = function (settings) {

  var path = `./${settings.locale}/matter/${settings.type}/${settings.name}`;
  var q = new Queue({ concurrency: 1 });

  // 1. Create directory path to new component.
  q.push(function (cb) {
    mkdirp(path, {}, cb);
  });

  // 2. Create component HBS and SCSS.
  q.push(function (cb) {
    var hbsContents  = getNewComponentHbs(settings.name);
    var sassContents = getNewComponentSass(settings.name);

    var numJobs = 2;
    var numJobsCompleted = 0;

    // Create 'component.hbs'.
    fs.writeFile(`${path}/${settings.name}.hbs`, hbsContents, function (err) {
      if (err) return cb(err);

      numJobsCompleted++;
      if (numJobsCompleted === numJobs) {
        cb(null);
      }
    });

    // Create '_component.scss'.
    fs.writeFile(`${path}/_${settings.name}.scss`, sassContents, function (err) {
      if (err) return cb(err);

      numJobsCompleted++;
      if (numJobsCompleted === numJobs) {
        cb(null);
      }
    });
  });

  // 3. If a data file is to be made, make it.
  if (settings.data) {
    var dataPath = `./${settings.locale}/data/${settings.type}`;

    q.push(function (cb) {
      mkdirp(dataPath, {}, cb);
    });

    q.push(function (cb) {
      var contents = getNewComponentJson();
      fs.writeFile(`${dataPath}/${settings.name}.json`, contents, cb);
    });
  }

  // Go.
  q.start(function (err) {
    if (err) throw err;
  });

};

function getNewComponentHbs(name) {
  return `{{!-- ${name}.hbs --}}

<div class="${name}">
  <p>Hello, I am your new "${name}" component.</p>
</div>
`;
}

function getNewComponentSass(name) {
  return `// _${name}.scss
//

.${name} {

  p {
    font-weight: bold;
  }
}
`;
}

function getNewComponentJson() {
  return `{
  "classes": ""
}
`;
}
