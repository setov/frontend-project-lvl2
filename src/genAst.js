import _ from 'lodash';

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

export default getAst;
