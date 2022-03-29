import _ from 'lodash';

const REPLACER = ' ';
const SPACES_COUNT = 2;

const stringify = (value, depth) => {
  const iter = (currentValue, depthIn) => {
    if (!(typeof currentValue === 'object') || _.isNull(currentValue)) {
      return currentValue;
    }
    const indentSize = (depthIn + SPACES_COUNT) * SPACES_COUNT;
    const currentIndent = REPLACER.repeat(indentSize + SPACES_COUNT);
    const bracketIndent = REPLACER.repeat(indentSize - SPACES_COUNT);

    const lines = Object.entries(currentValue).map(([key, val]) => `${currentIndent}${key}: ${iter(val, depthIn + 2)}`);
    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  };
  return iter(value, depth);
};

const stringByNodeType = (node, depth, fun) => {
  const indentSize = depth * SPACES_COUNT;
  const currentIndent = REPLACER.repeat(indentSize);
  const complexIndent = REPLACER.repeat(indentSize + SPACES_COUNT);
  const {
    name, type, valueBefore, valueAfteer, children,
  } = node;
  switch (type) {
    case 'unchanged':
      return `${currentIndent}  ${name}: ${stringify(valueBefore, depth)}`;
    case 'updated': {
      const line1 = `${currentIndent}- ${name}: ${stringify(valueBefore, depth)}`;
      const line2 = `${currentIndent}+ ${name}: ${stringify(valueAfteer, depth)}`;
      return line1.concat('\n', line2);
    }
    case 'removed':
      return `${currentIndent}- ${name}: ${stringify(valueBefore, depth)}`;
    case 'added':
      return `${currentIndent}+ ${name}: ${stringify(valueAfteer, depth)}`;
    case 'complex':
      return `${complexIndent}${name}: ${fun(children, depth + SPACES_COUNT)}`;
    default: throw new Error(`unexpected type ${type}`);
  }
};

const stringifyAst = (ast) => {
  const iter = (nodes, depth) => {
    const indentSize = depth * SPACES_COUNT;
    const bracketIndent = REPLACER.repeat(indentSize - SPACES_COUNT);
    const lines = nodes
      .map((node) => stringByNodeType(node, depth, iter));
    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  };
  return iter(ast, 1);
};

export default stringifyAst;
