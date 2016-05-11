// matter.js
//

'use strict';

var createError  = require('../createError');
var colliderfile = require('../colliderfile');
var logErrorExit = require('../logErrorExit');
var pkg = require('../../package.json');

var fs   = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var url  = require('url');

var _ = require('lodash');
var docopt = require('docopt').docopt;
var rimraf = require('rimraf');
var which = require('which');

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
  var args = {
    url: args['<url>'],
    locale: args['<locale>'],
  };

  // Re-assign the parsed URL to 'args.url'. The original can be found at 'args.url.href'.
  args.url = url.parse(args.url);

  // Verify the clone URL protocol is 'https:' or exit.
  var protocol = args.url.protocol;
  if (protocol !== 'https:') {
    var err = createError(
      `"${protocol}" is an unsupported protocol. URLs should start with "https:".`
    );
    logErrorExit(err, true);
  }

  // Set locale to the repo. name if it wasn't given.
  if (!args.locale) {
    args.locale = getRepoNameFromParsedUrl(args.url);
  }

  // Verify locale has the correct suffix.
  if (!args.locale.endsWith('-matter')) {
    var err = createError(`Unsupported locale. "${args.locale}" should have a "-matter" suffix.`);
    logErrorExit(err, true);
  }

  // Check `git` is installed before continuing.
  which('git', function (err) {
    if (err) throw err;
    spawn('git', ['clone', '--depth', 1, args.url.href, args.locale], { stdio: 'inherit' })
      .on('close', function (code, signal) {

        // If the clone was successful:
        if (code === 0) {
          colliderfile.get('.', function (data) {

            // Push a new Matter lib. object into the colliderfile data.
            data.matterLibs.push({
              url: args.url.href,
              locale: args.locale,
            });

            // Update the colliderfile with the new data.
            colliderfile.update(data, '.', function () {

              // Link the new Matter lib's Sass partial.
              updateMatterSass(data, '.', function () {
                console.log();
                console.log(`"${args.locale}" was cloned successfully! See 'collider matter'.`);
                console.log();
              });
            });
          });
        }
      });
  });

  /**
   * Retrieve a repo. name from a GitHub clone url.
   * @param  {Object} url A URL parsed using 'url.parse()'.
   * @return {String}     The repo's name.
   */
  function getRepoNameFromParsedUrl(url) {
    if (!url.pathname) {
      throw new Error('"pathname" does not exist.');
    }

    var repoName = path.basename(url.pathname, '.git');
    return repoName;
  }
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
      updateMatterSass(data, '.', function () {

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
 * Write the necessary Sass @imports to collider/_matter.scss.
 * @param  {Object}   colliderfile A .collider file in object-form.
 * @param  {String}   projectPath  The project path.
 * @param  {Function} cb           A callback function to call on success.
 */
function updateMatterSass(colliderfile, projectPath, cb) {
  var matterLibs  = colliderfile.matterLibs;
  var sassImports = ["@import '../project/matter/matter';"];

  // Add any Matter libs. to the 'sassImports' array.
  matterLibs.forEach(function (lib) {
    sassImports.push(`@import '../${lib.locale}/matter/matter';`);
  });

  // Join array members by a newline and terminate the string with a final newline.
  var data = sassImports.join('\n');
  data += '\n';

  fs.writeFile(`${projectPath}/collider/_matter.scss`, data, function (err) {
    if (err) throw err;
    if (typeof cb === 'function') {
      cb();
    }
  });
}
