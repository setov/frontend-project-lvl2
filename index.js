import getAst from './src/genAst.js';
import { readFile, getExtension } from './src/fileUtils.js';
import parse from './src/parsers.js';
import stringifyAst from './src/stringify.js';

export default (filePath1, filePath2) => {
  const data1 = parse(readFile([filePath1]), getExtension(filePath1));
  const data2 = parse(readFile([filePath2]), getExtension(filePath2));
  const ast = getAst(data1, data2);
  return stringifyAst(ast);
};
