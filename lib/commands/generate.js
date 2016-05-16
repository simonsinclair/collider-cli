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

var doc = `
usage:
  collider generate (atom | molecule | organism) [--data] <name> [<locale>]

options:
  --data  Additionally create a data file.
`;

module.exports = function (argv) {

  var args = docopt(doc, {
    argv: argv,
    version: `Collider CLI ${pkg.version}`,
  });

  // Which CMD was passed?
  var cmds = ['atom', 'molecule', 'organism'];
  var cmd;
  for (var i = 0; i < cmds.length; i++) {
    cmd = cmds[i];
    if (args[cmd]) break;
  }

  var categories = {
    atom: 'atoms',
    molecule: 'molecules',
    organism: 'organisms',
  };

  var category = categories[cmd];
  var name     = args['<name>'];
  var locale   = args['<locale>'] || 'project';
  var hasData  = args['--data'];

  generate(category, name, locale, hasData);
};

// FUNCTIONS
//

/**
 * Generate skeleton Matter files for a component.
 * @param  {String} category The category of the component, e.g. molecules.
 * @param  {String} name     The component name.
 * @param  {String} locale   An optional Matter library context.
 * @param  {Bool}   hasData  Whether to also generate a data file.
 */
function generate(category, name, locale, hasData) {
  var matterDir = `./${locale}/matter/${category}/${name}`;
  var dataDir = `./${locale}/data/${category}`;
  var localePrefix = locale !== 'project' ? `${locale}/` : '';

  colliderfile.exists('.', function (err) {
    if (err) throw err;

    mkdirp(matterDir, {}, function (err) {
      if (err) throw err;

      // Write skeleton Sass stylesheet.
      writeSkeletonFile(
        `${matterDir}`,
        `_${name}.scss`,
        `// ${localePrefix}_${name}.scss\n//\n\n.${name} {}\n`,
      function (err) {
        if (err) {
          var err = createError(`Failed to create skeleton stylesheet in ${matterDir}.`);
          logErrorExit(err, false);
        }

        console.log(`- Skeleton stylesheet "_${name}.scss" created successfully.`);
        console.log(`  Please @import it in "./${locale}/matter/_matter.scss".`);
      });

      // Write skeleton Handlebars template.
      writeSkeletonFile(
        `${matterDir}`,
        `${name}.hbs`,
        `{{! ${localePrefix}${name}.hbs }}\n`,
      function (err) {
        if (err) {
          var err = createError(`Failed to create skeleton template in ${matterDir}.`);
          logErrorExit(err, false);
        }

        console.log(`- Skeleton template "${name}.hbs" created successfully.`);
      });

      // Write skeleton data file if asked.
      if (hasData) {
        mkdirp(dataDir, {}, function (err) {
          if (err) throw err;

          writeSkeletonFile(
            `${dataDir}`,
            `${name}.json`,
            `{\n  "classes": ""\n}\n`,
          function (err) {
            if (err) {
              var err = createError(`Failed to create skeleton data in ${dataDir}.`);
              logErrorExit(err, false);
            }

            console.log(`- Skeleton data "${name}.json" created successfully.`);
          });
        });
      }

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
