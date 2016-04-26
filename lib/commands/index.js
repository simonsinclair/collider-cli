// index.js
//

'use strict';

module.exports = {
  run: require('./run'),
  new: require('./new'),
  matter: {
    clone: require('./matter/clone'),
    remove: require('./matter/remove')
  },
  generate: require('./generate')
};
