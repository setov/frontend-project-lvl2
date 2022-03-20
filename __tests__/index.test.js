import gendiff from '../index.js';
import { readFile, buildPath } from '../src/genDiff.js';

const getFixturePath = (filename) => buildPath(['__fixtures__', filename]);

const expectedData = { plain: [] };

beforeAll(() => {
  const plainData = readFile([getFixturePath('expected_flat.txt')]);
  expectedData.plain = plainData.trim();
});

test('plain object', () => {
  const filePath1 = getFixturePath('flatFile1.json');
  const filePath2 = getFixturePath('flatFile2.json');

  const actual = gendiff(filePath1, filePath2);
  const expected = expectedData.plain;
  expect(actual).toEqual(expected);
});
