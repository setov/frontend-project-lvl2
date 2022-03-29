import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const mapping = {
  stylish,
  plain,
  json,
};

const format = (ast, outputFormat) => {
  const getFormat = mapping[outputFormat] ?? mapping[stylish];
  return getFormat(ast);
};

export default format;
