// collider.js
//

var pkg   = require('../package.json');
var utils = require('./utils');

var fs   = require('fs');
var os   = require('os');
var path = require('path');

var Joi = require('joi');

var schema = Joi.object({
  name: Joi.string(),
  author: Joi.string(),
  matterLibs: Joi.array(),
});

module.exports = {

  update: function (dir, cb) {
    var tmpArchive = path.join(os.tmpdir(), 'latest.tar.gz');

    utils.download('http://getcollider.com/latest.tar.gz', tmpArchive, {
      headers: { 'User-Agent': `collider-cli/${pkg.version}`, },
      timeout: 10000,
    }, function (err) {
      if (err) return cb(err);

      utils.extractTarGz(tmpArchive, dir, ['project/'], cb);
    });
  },

  save: function (dir, obj, cb) {
    var file = `${dir}/collider.json`;

    schema.validate(obj, { stripUnknown: true, presence: 'required' }, function (err, project) {
      if (err) throw err;

      var str = '';
      try {
        str = JSON.stringify(project, null, 2);
      } catch (stringifyErr) {
        return cb(stringifyErr);
      }

      fs.writeFile(file, str, cb);
    });
  },

  load: function (dir, cb) {
    var file = `${dir}/collider.json`;

    fs.readFile(file, 'utf8', function (err, data) {
      if (err) return cb(err);

      var obj = {};
      try {
        obj = JSON.parse(data);
      } catch (parseErr) {
        parseErr.message = `${file} - ${parseErr.message}`;
        return cb(parseErr);
      }

      cb(null, obj);
    });
  },

  deps: [
    'collider',
    'node_modules',
    'gulpfile.js',
    'package.json',
  ],

};
