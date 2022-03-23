import gendiff from '../index.js';
import { readFile, buildPath } from '../src/genDiff.js';

const getFixturePath = (filename) => buildPath(['__fixtures__', filename]);

const expectedData = { plain: [], complex: [] };

beforeAll(() => {
  const plainData = readFile([getFixturePath('expected_flat.txt')]);
  const complexData = readFile([getFixturePath('expected_complex.txt')]);
  expectedData.plain = plainData.trim();
  expectedData.complex = complexData.trim();
});

test('plain object', () => {
  const filePath1 = getFixturePath('flatFile1.json');
  const filePath2 = getFixturePath('flatFile2.json');

  const actual = gendiff(filePath1, filePath2);
  const expected = expectedData.plain;
  expect(actual).toEqual(expected);
});

test('complex object', () => {
  const filePath1 = getFixturePath('complexFile1.json');
  const filePath2 = getFixturePath('complexFile2.json');

  const actual = gendiff(filePath1, filePath2);
  const expected = expectedData.complex;
  expect(actual).toEqual(expected);
});
