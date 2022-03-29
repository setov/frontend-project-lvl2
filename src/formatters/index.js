import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const mapping = {
  stylish: (data) => stylish(data),
  plain: (data) => plain(data),
  json: (data) => json(data),
};

export default (ast, outputFormat) => mapping[outputFormat](ast) ?? mapping[stylish](ast);
