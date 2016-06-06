// extractTarGz.js
//

'use strict';

var fs = require('fs');

var tar  = require('tar-fs');
var zlib = require('zlib');

function extractTarGz(archive, dest, cb) {
  var stream = fs.createReadStream(archive);

  stream
    .on('error', throwError)

  // Gunzip.
  .pipe(zlib.createGunzip())
    .on('error', throwError)

  // Untar.
  .pipe(tar.extract(dest, {
    dmode: Number('0555'),
    fmode: Number('0444'),
  }))
    .on('error', throwError)
    .on('finish', function () {
      if (typeof cb === 'function') {
        cb();
      }
    });
}

function throwError(err) {
  throw err;
}

module.exports = extractTarGz;
