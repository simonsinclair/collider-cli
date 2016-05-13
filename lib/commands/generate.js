// generate.js
//

'use strict';

var createError  = require('../createError');
var colliderfile = require('../colliderfile');
var logErrorExit = require('../logErrorExit');
var pkg = require('../../package.json');

var docopt = require('docopt').docopt;
var fs = require('fs');
var mkdirp = require('mkdirp');

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
  var dir = `./${locale}/matter/${type}/${name}`;
  var prefix = locale !== 'project' ? `${locale}/` : '';

  colliderfile.exists('.', function (err) {
    if (err) throw err;

    mkdirp(dir, {}, function (err) {
      if (err) throw err;

      // Write skeleton Sass stylesheet.
      writeSkeletonFile(
        `${dir}`,
        `_${name}.scss`,
        `// ${prefix}_${name}.scss\n//\n\n.${name} {}\n`,
      function (err) {
        if (err) {
          var err = createError(`Failed to create skeleton stylesheet in ${dir}.`);
          logErrorExit(err, false);
        }
      });

      // Write skeleton Handlebars template.
      writeSkeletonFile(
        `${dir}`,
        `${name}.hbs`,
        `{{! ${prefix}${name}.hbs }}\n\n`,
      function (err) {
        if (err) {
          var err = createError(`Failed to create skeleton template in ${dir}.`);
          logErrorExit(err, false);
        }
      });

    });
  });
};

function writeSkeletonFile(dir, file, data, cb) {
  fs.access(`${dir}/${file}`, fs.F_OK, function (err) {
    if (err) {
      fs.writeFile(`${dir}/${file}`, data, function (err) {
        if (err) return cb(err);
        cb(null);
      });
    }
  });
}
