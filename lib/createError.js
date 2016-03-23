/**
 * Returns a new Error object with an optionally set code property.
 *
 * @param  {string} msg  A description of the error
 * @param  {string} code An error code beginning with E
 * @return {Error}
 */

function createError(msg, code) {
  var err  = new Error(msg);
  err.code = code;

  return err;
}

module.exports = createError;
