// download.js
//

'use strict';

var fs = require('fs');

var ProgressBar = require('progress');
var request     = require('request');

function download(url, file, options, cb) {

  request(url, options)
    .on('response', function (response) {

      if (process.stdout.isTTY) {

        var contentLength = Number(response.headers['content-length']);
        var progressBar   = new ProgressBar('Downloading [:bar] :percent ETA :etas ', {
          total: contentLength,
          incomplete: ' ',
          clear: true,
        });

        response.on('data', function (chunk) {
          progressBar.tick(chunk.length);
        });
      }

      response.on('error', throwError);
    })
    .on('error', throwError)

    // Write 'file'.
    .pipe(fs.createWriteStream(file))
      .on('finish', function () {
        if (typeof cb === 'function') {
          cb();
        }
      });
}

function throwError(err) {
  throw err;
}

module.exports = download;
