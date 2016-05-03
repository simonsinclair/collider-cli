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
 * Dispatch a command when the required arg vector matches the object docopts returns.
 * @param  {array}    argv  The required arg vector.
 * @param  {object}   args  An object of options, args and commands as keys, which
 *                          is provided by docopts.
 * @param  {function} cmd   The command handler to call with args.
 */
function dispatchOn(argv, args, cmd) {
  // ...
  cmd(args);

function matterList(options) {
  console.log('matter list:', options);
}

function matterClone(args) {
  console.log('matter clone:', args);
}

function matterRemove(args) {
  console.log('matter remove:', args);
}
