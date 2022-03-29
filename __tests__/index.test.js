import gendiff from '../index.js';
import { readFile, buildPath } from '../src/fileUtils.js';

const getFixturePath = (filename) => buildPath(['__fixtures__', filename]);

const expectedData = { stylish: [], plain: [], json: [] };
const formats = ['stylish', 'plain', 'json'];

beforeAll(() => {
  const complexDataStylish = readFile([getFixturePath('expected_complex.txt')]);
  const complexDataPlain = readFile([getFixturePath('expected_plain.txt')]);
  const complexDataJson = readFile([getFixturePath('expected_json.json')]);
  expectedData.stylish = complexDataStylish.trim();
  expectedData.plain = complexDataPlain.trim();
  expectedData.json = complexDataJson.trim();
});

test('complex object json format', () => {
  const filePath1 = getFixturePath('complexFile1.json');
  const filePath2 = getFixturePath('complexFile2.json');

  const [stylish] = formats;
  const actual = gendiff(filePath1, filePath2, stylish);
  const expected = expectedData.stylish;
  expect(actual).toEqual(expected);
});

test('complex object yaml format', () => {
  const filePath1 = getFixturePath('complexFile1.yaml');
  const filePath2 = getFixturePath('complexFile2.yaml');

  const [stylish] = formats;
  const actual = gendiff(filePath1, filePath2, stylish);
  const expected = expectedData.stylish;
  expect(actual).toEqual(expected);
});

test('complex object plain format', () => {
  const filePath1 = getFixturePath('complexFile1.json');
  const filePath2 = getFixturePath('complexFile2.json');

  const [, plain] = formats;
  const actual = gendiff(filePath1, filePath2, plain);
  const expected = expectedData.plain;
  expect(actual).toEqual(expected);
});

test('complex object json format', () => {
  const filePath1 = getFixturePath('complexFile1.json');
  const filePath2 = getFixturePath('complexFile2.json');

  const [,, json] = formats;
  const actual = gendiff(filePath1, filePath2, json);
  const expected = expectedData.json;
  expect(actual).toEqual(expected);
});
