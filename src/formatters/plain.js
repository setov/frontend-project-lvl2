import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return value;
};

const plainAst = (ast) => {
  const stringByNodeType = (node, ancestor, fun) => {
    const {
      name, type, valueBefore, valueAfteer, children,
    } = node;
    const newAncestor = ancestor === '' ? `${name}` : `${ancestor}.${name}`;
    const beforeValue = stringify(valueBefore);
    const afterValue = stringify(valueAfteer);
    switch (type) {
      case 'unchanged':
        return '';
      case 'updated': {
        return `Property '${newAncestor}' was updated. From ${beforeValue} to ${afterValue}`;
      }
      case 'removed':
        return `Property '${newAncestor}' was removed`;
      case 'added':
        return `Property '${newAncestor}' was added with value: ${afterValue}`;
      case 'complex':
        return fun(children, newAncestor);
      default: throw new Error(`unexpected type ${type}`);
    }
  };

  const iter = (nodes, ancestor) => {
    const lines = nodes
      .map((node) => stringByNodeType(node, ancestor, iter));
    return lines.filter((item) => item).join('\n');
  };
  return iter(ast, '');
};

export default plainAst;
