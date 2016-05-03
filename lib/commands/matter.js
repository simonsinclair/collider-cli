// matter.js
//

'use strict';

var createError  = require('../createError');
var logErrorExit = require('../logErrorExit');
var pkg = require('../../package.json');

var _ = require('lodash');
var docopt = require('docopt').docopt;

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
  _.forEach(args, function(val, key) {
    if(val === true) haystack.push(key);
  });

  // If 'commands' and 'haystack' match, then fire our callback.
  if(_.isEqual(commands.sort(), haystack.sort())) {
    callback(args);
  }
}


function matterList(options) {
  console.log('matter list:', options);
}

function matterClone(options) {
  console.log('matter clone:', options);
}

function matterRemove(options) {
  console.log('matter remove:', options);
}
