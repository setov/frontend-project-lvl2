import _ from 'lodash';

const stringifyAst = (ast, replacer = ' ', spacesCount = 2) => {
  const stringify = (value, depth) => {
    const iter = (currentValue, depthIn) => {
      if (!(typeof currentValue === 'object') || _.isNull(currentValue)) {
        return currentValue;
      }
      const indentSize = (depthIn + spacesCount) * spacesCount;
      const currentIndent = replacer.repeat(indentSize + spacesCount);
      const bracketIndent = replacer.repeat(indentSize - spacesCount);

      const lines = Object.entries(currentValue).map(([key, val]) => `${currentIndent}${key}: ${iter(val, depthIn + 2)}`);
      return ['{', ...lines, `${bracketIndent}}`].join('\n');
    };
    return iter(value, depth);
  };

  const stringByNodeType = (node, depth, fun) => {
    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize);
    const complexIndent = replacer.repeat(indentSize + spacesCount);
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
        return `${complexIndent}${name}: ${fun(children, depth + spacesCount)}`;
      default: throw new Error(`unexpected type ${type}`);
    }
  };

  const iter = (nodes, depth) => {
    const indentSize = depth * spacesCount;
    const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const lines = nodes
      .map((node) => stringByNodeType(node, depth, iter));
    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  };
  return iter(ast, 1);
};

export default stringifyAst;
