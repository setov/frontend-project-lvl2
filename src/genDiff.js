import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildPath = (paths) => path.resolve(__dirname, '..', ...paths);
const readFile = (paths) => fs.readFileSync(buildPath(paths), 'utf-8');

const makeNode = (type, name, valueBefore = '', valueAfteer = '', children = []) => (
  {
    type,
    name,
    valueBefore,
    valueAfteer,
    children,
  }
);

const keyTypes = [
  {
    check: (first, second, key) => (first[key] instanceof Object && second[key] instanceof Object)
    && !(first[key] instanceof Array && second[key] instanceof Array),
    node: (name, first, second, fun) => makeNode('complex', name, null, null, fun(first, second)),
  },
  {
    check: (first, second, key) => (_.has(first, key) && _.has(second, key)
    && (first[key] === second[key])),
    node: (name, first) => makeNode('unchanged', name, first),
  },
  {
    check: (first, second, key) => (_.has(first, key) && _.has(second, key)
    && (first[key] !== second[key])),
    node: (name, first, second) => makeNode('updated', name, first, second),
  },
  {
    check: (first, second, key) => (_.has(first, key) && !_.has(second, key)),
    node: (name, first) => makeNode('removed', name, first),
  },
  {
    check: (first, second, key) => (!_.has(first, key) && _.has(second, key)),
    node: (name, first, second) => makeNode('added', name, first, second),
  },
];

const getKeyAction = (first, second, key) => keyTypes
  .find(({ check }) => check(first, second, key));

const getAst = (firstConfig = {}, secondConfig = {}) => {
  const unionKeys = _.sortBy(_.union(Object.keys(firstConfig), Object.keys(secondConfig)));
  return unionKeys.map((key) => {
    const { node } = getKeyAction(firstConfig, secondConfig, key);
    return node(key, firstConfig[key], secondConfig[key], getAst);
  });
};

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

const genDiff = (filePath1, filePath2) => {
  const data1 = readFile([filePath1]);
  const data2 = readFile([filePath2]);
  const fileConfig1 = JSON.parse(data1);
  const fileConfig2 = JSON.parse(data2);

  const ast = getAst(fileConfig1, fileConfig2);
  return stringifyAst(ast);
};
export default genDiff;
export { readFile, buildPath };
