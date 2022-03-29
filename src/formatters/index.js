import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const mapping = {
  stylish,
  plain,
  json,
};

export default (ast, format) => (mapping[format](ast) ?? mapping[stylish](ast));
