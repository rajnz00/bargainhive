// .github/ajv.config.mjs
import addFormats from "ajv-formats";

/**
 * Ajv CLI loads this module and calls the default-exported function.
 * The function receives the Ajv *constructor* (not an instance).
 * Return a configured Ajv instance.
 */
export default function (Ajv) {
  // loosen strictness to be friendly with simple schemas / data
  const ajv = new Ajv({
    strict: false,
    allErrors: true,
  });

  // add common string/number formats (email, uri, date-time, etc.)
  addFormats(ajv);

  return ajv;
}
