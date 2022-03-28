import stylish from './stylish.js';
import plain from './plain.js';

const mapping = {
  stylish,
  plain,
};

export default (ast, format) => mapping[format](ast) ?? mapping[stylish](ast);
