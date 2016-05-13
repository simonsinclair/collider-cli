// generate.js
//

'use strict';

var createError  = require('../createError');
var logErrorExit = require('../logErrorExit');
var pkg = require('../../package.json');

var docopt = require('docopt').docopt;

// GENERATE
//

var doc = 'usage: collider generate (atom | molecule | organism) <name> [<locale>]';

module.exports = function (argv) {

  var args = docopt(doc, {
    argv: argv,
    version: `Collider CLI ${pkg.version}`,
  });

  var name   = args['<name>'];
  var locale = args['<locale>'] || 'project';

  var cmds = ['atom', 'molecule', 'organism'];

  var cmd;
  for (var i = 0; i < cmds.length; i++) {
    cmd = cmds[i];
    if (args[cmd]) break;
  }

  generate(cmd, name, locale);

};

// FUNCTIONS
//

function generate(type, name, locale) {
  console.log(type, name, locale);
};
