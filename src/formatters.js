import stylish from './stylish.js';

const mapping = {
  stylish,
};

export default (ast, format) => mapping[format](ast) ?? mapping[stylish](ast);
