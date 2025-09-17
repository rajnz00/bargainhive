// .github/ajv.config.mjs
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

export default function createAjv() {
  const ajv = new Ajv({
    strict: false,       // be tolerant of common schema quirks
    allErrors: true
  });
  addFormats(ajv);       // adds "email", "uri", etc.
  return ajv;
}
