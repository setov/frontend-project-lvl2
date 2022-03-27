import gendiff from '../index.js';
import { readFile, buildPath } from '../src/fileUtils.js';

const getFixturePath = (filename) => buildPath(['__fixtures__', filename]);

const expectedData = { complex: [] };
const formats = ['stylish'];

beforeAll(() => {
  const complexData = readFile([getFixturePath('expected_complex.txt')]);
  expectedData.complex = complexData.trim();
});

test('complex object json format', () => {
  const filePath1 = getFixturePath('complexFile1.json');
  const filePath2 = getFixturePath('complexFile2.json');

  const [stylish] = formats;
  const actual = gendiff(filePath1, filePath2, stylish);
  const expected = expectedData.complex;
  expect(actual).toEqual(expected);
});

test('complex object yaml format', () => {
  const filePath1 = getFixturePath('complexFile1.yaml');
  const filePath2 = getFixturePath('complexFile2.yaml');

  const [stylish] = formats;
  const actual = gendiff(filePath1, filePath2, stylish);
  const expected = expectedData.complex;
  expect(actual).toEqual(expected);
});
