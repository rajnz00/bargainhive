// .github/ajv.config.mjs
// Ajv CLI expects a function that receives the Ajv instance
export default function configureAjv(ajv) {
  // Example: allow additional properties and disable strict mode
  ajv.opts.strict = false;

  // If you’re using ajv-formats, add them here:
  try {
    const addFormats = (await import('ajv-formats')).default;
    addFormats(ajv);
  } catch (e) {
    console.warn('ajv-formats not found, continuing without it');
  }

  // Return the configured instance
  return ajv;
}
