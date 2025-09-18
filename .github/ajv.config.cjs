// .github/ajv.config.cjs
module.exports = function (ajv) {
  ajv.opts.strict = false;
  ajv.opts.allErrors = true;

  try {
    require('ajv-formats')(ajv);
  } catch {
    console.warn('ajv-formats not found, continuing without it');
  }

  return ajv;
};
