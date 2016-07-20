// new.js
//

'use strict';

var download     = require('../download');
var extractTarGz = require('../extractTarGz');
var pkg = require('../../package.json');

var fs   = require('fs');
var os   = require('os');
var path = require('path');

var jsonfile = require('jsonfile');
var Queue    = require('queue');

module.exports = function (options) {

  // To do: Validate 'options'.
  options = options || {};

  var projectPath = path.join(options.dir, options.name);
  var tmpArchive  = path.join(os.tmpdir(), 'latest.tar.gz');

  var q = new Queue({ concurrency: 1 });

  // 1. Create project dir.
  q.push(function (cb) {
    fs.mkdir(projectPath, cb);
  });

  // 2. Download Collider release.
  q.push(function (cb) {
    download('http://getcollider.com/latest.tar.gz', tmpArchive, {
      headers: { 'User-Agent': `collider-cli/${pkg.version}`, },
      timeout: 10000,
    }, cb);
  });

  // 3. Extract Collider release into project dir.
  q.push(function (cb) {
    console.log('Download complete. Extracting...');
    extractTarGz(tmpArchive, projectPath, cb);
  });

  // 4. Write collider file.
  q.push(function (cb) {
    jsonfile.writeFile(`${projectPath}/collider.json`, options, { spaces: 2 }, cb);
  });

  // Go.
  q.start(function (err) {
    if (err) {
      q.end(err);
      throw err;
    }

    console.log(`Extraction complete. Your new project is located at "${projectPath}".`);
  });

};
