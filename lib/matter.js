// matter.js
//

'use strict';

var utils = require('./utils');

var fs  = require('fs');
var cp  = require('child_process');
var url = require('url');

var rimraf = require('rimraf');
var Queue  = require('queue');
var which  = require('which');

module.exports = {

  updateImports: function (libs, cb) {
    var imports = [];
    var data    = '';

    libs.forEach(function (lib) {
      var locale = getLocale(lib);
      imports.push(`@import "../${locale}/matter/index";`);
    });

    data = imports.join('\n');
    data += '\n';

    fs.writeFile('./collider/_matter.scss', data, cb);
  },

  clean: function (lib, cb) {
    var locale = getLocale(lib);

    utils.exists(`./${locale}/matter/_matter.scss`, function (err) {

      // Callback silently if 'locale' is not a Matter lib.
      if (err) cb(null);

      rimraf(`./${locale}`, { disableGlob: true }, cb);
    });
  },

  clone: function (lib, done) {
    var cloneUrl = url.parse(getCloneUrl(lib));
    var locale   = getLocale(lib);

    var q = new Queue({ concurrency: 1 });

    // 1. Check if cloneUrl protocol is 'https:'.
    q.push(function (cb) {
      if (cloneUrl.protocol !== 'https:') {
        var err = utils.createError(
          `"${protocol}" is an unsupported protocol. URLs should start with "https:".`
        );
        cb(err);
      }

      cb(null);
    });

    // 2. Check Git is installed.
    q.push(function (cb) {
      which('git', cb);
    });

    // 3. Check 'cloneUrl.href' is a valid Git-remote.
    q.push(function (cb) {
      isValidGitRemote(cloneUrl.href, cb);
    });

    // 4. Verify lib. locale has the correct suffix.
    q.push(function (cb) {
      if (!locale.endsWith('-matter')) {
        var err = utils.createError(
          `Unsupported locale. "${locale}" should have a "-matter" suffix.`
        );
        cb(err);
      }

      cb(null);
    });

    // 5. Git clone the Matter lib.
    q.push(function (cb) {
      cp.spawn('git', ['clone', cloneUrl.href, locale], { stdio: 'inherit' })
        .on('close', function (code) {
          if (code !== 0) {
            var err = utils.createError(
              `There was a problem cloning the Matter lib. from "${cloneUrl.href}".`
            );
            cb(err);
          }

          cb(null);
        });
    });

    // Go.
    q.start(function (err) {
      done(err);
    });
  },

  getLocale: getLocale,

};

/**
 * Retrieves a Matter lib's clone URL from a formulated string.
 * @param  {string} matterLib collider.json matterLib item.
 * @return {string}           A Matter lib's clone URL.
 */
function getCloneUrl(lib) {
  var cloneUrl = lib.split(',')[0];
  return cloneUrl;
}

/**
 * Retrieves a Matter lib's locale from a formulated string.
 * @param  {string} matterLib collider.json matterLib item.
 * @return {string}           A Matter lib's locale.
 */
function getLocale(lib) {
  var locale = lib.split(',')[1];
  return locale;
}

/**
 * Uses `git ls-remote` to check if the given URL is an accessible Git repo.
 * @param  {String}  url A URL to a remote git repository.
 */
function isValidGitRemote(url, cb) {
  cp.exec(`git ls-remote ${url}`, cb);
}
