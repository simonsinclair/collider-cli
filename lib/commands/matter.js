// matter.js
//

'use strict';

var createError  = require('../createError');
var logErrorExit = require('../logErrorExit');
var pkg = require('../../package.json');

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
  console.log(argv);

  var args = docopt(doc, {
    argv: argv,
    version: `Collider CLI ${pkg.version}`,
  });

  dispatchOn(['matter', 'clone'], args, matterClone);
  dispatchOn(['matter', 'remove'], args, matterRemove);
  dispatchOn(['matter', 'rm'], args, matterRemove);
};

// FUNCTIONS
//

/**
 * Dispatch a command when the arg vector is truthy in the object docopts provides.
 * @param  {array}    argv  An array of string arguments to match.
 * @param  {object}   args  An object of options, args and commands as keys.
 * @param  {function} cmd   The command handler to call.
 */
function dispatchOn(argv, args, cmd) {
  // ...
  cmd(args);
}

function matterClone(args) {
  console.log('matter clone:', args);
}

function matterRemove(args) {
  console.log('matter remove:', args);
}
