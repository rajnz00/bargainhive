// .github/ajv.config.cjs
// ajv-cli@5 expects this module to export a FUNCTION that receives an Ajv instance.
// Return the configured Ajv instance.

module.exports = function (ajv) {
  // be tolerant (we already enforce essentials in schema)
  ajv.opts.strict = false;
  ajv.opts.allErrors = true;

  // add common formats if available (email, uri, date-time, etc.)
  try {
    require('ajv-formats')(ajv);
  } catch (e) {
    // optional dependency: fine if missing
    console.warn('ajv-formats not found, continuing without it');
  }

  return ajv;
};
