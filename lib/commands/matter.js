// matter.js
//

'use strict';

var createError  = require('../createError');
var colliderfile = require('../colliderfile');
var logErrorExit = require('../logErrorExit');
var pkg = require('../../package.json');

var fs = require('fs');

var _ = require('lodash');
var docopt = require('docopt').docopt;
var rimraf = require('rimraf');

var doc = `
usage:
  collider matter
  collider matter clone <url> [<locale>]
  collider matter (rm | remove) <locale>

options:
  -h, --help  Show help information.
  --version   Show program version.

commands:
  clone       Clone a Matter library into the current project.
  remove, rm  Remove a Matter library from the current project.

  With no command, 'matter' shows a list of Matter libraries in the current project.
`;

module.exports = function (argv) {

  var args = docopt(doc, {
    argv: argv,
    version: `Collider CLI ${pkg.version}`,
  });

  dispatchOn(['matter'], args, matterList);
  dispatchOn(['matter', 'clone'], args, matterClone);
  dispatchOn(['matter', 'remove'], args, matterRemove);
  dispatchOn(['matter', 'rm'], args, matterRemove);
};

// FUNCTIONS
//

/**
 * Dispatch a callback when the given commands match those given to docopts.
 * @param  {Array}    commands An array of commands to match.
 * @param  {Object}   args     A docopts arguments object.
 * @param  {Function} callback The command handler to call.
 */
function dispatchOn(commands, args, callback) {
  var haystack = [];

  // For each truthy and Boolean-type arg, push its name into 'haystack'.
  _.forEach(args, function (val, key) {
    if (val === true) haystack.push(key);
  });

  // If 'commands' and 'haystack' match, then fire our callback.
  if (_.isEqual(commands.sort(), haystack.sort())) {
    callback(args);
  }
}

function matterList() {
  colliderfile.get('.', printMatterInfo);

  function printMatterInfo(data) {
    var matterLibs = data.matterLibs;
    var librarySingOrPlur = matterLibs.length > 1 ? 'libraries' : 'library';

    if (matterLibs.length > 0) {
      console.log();
      console.log(`'${data.name}' has ${matterLibs.length} Matter ${librarySingOrPlur}:`);

      matterLibs.forEach(function (library, i) {
        console.log();
        console.log(`${i + 1}. ${library.locale}`);
        console.log(`   ${library.url}`);
      });

      console.log();
    } else {
      console.log();
      console.log(`'${data.name}' has 0 Matter libraries. See 'collider matter --help'.`);
      console.log();
    }
  }
}

function matterClone(args) {
  var url    = args['<url>'];
  var locale = args['<locale>'];
}

function matterRemove(args) {
  var locale = args['<locale>'];

  // Check that 'locale' is a Matter library before attempting to delete it.
  fs.access(`./${locale}/matter/_matter.scss`, fs.F_OK, function (err) {
    if (err) throw err;

    // Get Collider-file data.
    colliderfile.get('.', function (data) {
      var projectName    = data.name;
      var createdTime    = data.createdTime;
      var author         = data.author;
      var currMatterLibs = data.matterLibs;

      // Filter Matter library to remove from Matter array.
      var newMatterLibs = currMatterLibs.filter(function (matter) {
        return matter.locale !== locale;
      });

      // 1. Remove _matter.scss @import entry.
      // 2. Then remove the Matter Collider-file entry.
      // 3. And then remove the Matter library directory.
      updateMatterSass(data, './collider/_matter.scss', function () {

        colliderfile.update({
          name: projectName,
          createdTime: createdTime,
          author: author,
          matterLibs: newMatterLibs,
        }, '.',
        function () {
          rimraf(`./${locale}`, function (err) {
            if (err) throw err;
          });
        });
      });

    });

  });
}

/**
 * Write the necessary Matter SASS @imports to a file.
 * @param  {Object}   colliderfile A Collider-file in JSON.
 * @param  {String}   path         The path to the file to write.
 * @param  {Function} cb           A callback function.
 */
function updateMatterSass(colliderfile, path, cb) {
  console.log(data, path);
  cb();
}
