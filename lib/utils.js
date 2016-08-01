// utils.js
//

'use strict';

var fs = require('fs');

var chalk       = require('chalk');
var ProgressBar = require('progress');
// var Promise     = require('bluebird');
var request     = require('request');
var tar         = require('tar-fs');
var zlib        = require('zlib');

module.exports = {

  exists: function (path, cb) {
    // return new Promise(function (resolve, reject) {
    //   fs.access(path, fs.F_OK, function (err) {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve();
    //     }
    //   });
    // });

    fs.access(path, fs.F_OK, cb);
  },

  createError: function (msg, code) {
    var err  = new Error(msg);
    err.code = code;

    return err;
  },

  logErrorExit: function (err, exit) {
    console.error();
    console.error(chalk.red('Error:'), chalk.red(err.message));
    console.error();

    if (exit) {
      process.exit(1);
    }
  },

  download: function (url, file, options, cb) {
    cb = cb || noop;

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

        response.on('error', function (err) {
          cb(err);
        });
      })
      .on('error', function (err) {
        cb(err);
      })

      // Write 'file'.
      .pipe(fs.createWriteStream(file))
        .on('finish', function () {
          cb(null);
        });
  },

  extractTarGz: function (archive, dest, cb) {
    var stream = fs.createReadStream(archive);
    cb = cb || noop;

    stream
      .on('error', function (err) {
        cb(err);
      })

    // Gunzip.
    .pipe(zlib.createGunzip())
      .on('error', function (err) {
        cb(err);
      })

    // Untar.
    .pipe(tar.extract(dest, {
      dmode: Number('0555'),
      fmode: Number('0444'),
    }))
      .on('error', function (err) {
        cb(err);
      })
      .on('finish', function () {
        cb(null);
      });
  },

  noop: noop,

};

function noop() {}
