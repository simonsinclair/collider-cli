// status.js
//

'use strict';

var createError  = require('../createError');
var logErrorExit = require('../logErrorExit');

var yargs = require('yargs');

// MATTER
//

module.exports = {

  builder: {},

  handler: function(argv) {

    console.log(argv);

  },

};
