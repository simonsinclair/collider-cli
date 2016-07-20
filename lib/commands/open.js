// open.js
//

'use strict';

var pkg   = require('../../package.json');
var utils = require('../utils');

var spawn = require('child_process').spawn;

module.exports = function () {

  utils.exists('./collider.json', function (err) {
    if (err) throw err;
    spawn('./node_modules/.bin/gulp', ['default'], { stdio: 'inherit' });
  });

};
