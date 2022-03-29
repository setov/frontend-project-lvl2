import yaml from 'js-yaml';

const mapping = {
  json: JSON.parse,
  yml: yaml.load,
  yaml: yaml.load,
};

const parse = (data, type) => {
  if (!Object.prototype.hasOwnProperty.call(mapping, type)) {
    throw new Error(`Unexpected file extension ${type}`);
  }
  return mapping[type](data);
};

export default parse;
