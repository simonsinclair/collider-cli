// collider.js
//

var fs = require('fs');

var Joi = require('joi');

var schema = Joi.object({
  name: Joi.string(),
  author: Joi.string(),
  matterLibs: Joi.array(),
});

module.exports = {

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

};
