// new.js
//

'use strict';

var collider = require('../collider');
var pkg      = require('../../package.json');
var utils    = require('../utils');

var cp   = require('child_process');
var fs   = require('fs');
var os   = require('os');
var path = require('path');

var Queue = require('queue');

module.exports = function (settings) {

  var projectPath = path.join(settings.dir, settings.name);
  var tmpArchive  = path.join(os.tmpdir(), 'latest.tar.gz');

  var q = new Queue({ concurrency: 1 });

  // 1. Create project dir.
  q.push(function (cb) {
    fs.mkdir(projectPath, cb);
  });

  // 2. Download Collider release.
  q.push(function (cb) {
    utils.download('http://getcollider.com/latest.tar.gz', tmpArchive, {
      headers: { 'User-Agent': `collider-cli/${pkg.version}`, },
      timeout: 10000,
    }, cb);
  });

  // 3. Extract Collider release into project dir.
  q.push(function (cb) {
    console.log('Download complete. Extracting...');
    utils.extractTarGz(tmpArchive, projectPath, [], cb);
  });

  // 4. Write collider file.
  q.push(function (cb) {
    console.log(`Extraction complete. Your project is located at "${projectPath}".`);
    collider.save(projectPath, settings, cb);
  });

  // Go.
  q.start(function (err) {
    if (err) throw err;
  });

};
