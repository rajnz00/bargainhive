// .github/ajv.config.mjs
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

export default function createAjv() {
  const ajv = new Ajv({ strict: false, allErrors: true });
  addFormats(ajv);
  return ajv;
}
