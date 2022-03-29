/* eslint-disable fp/no-mutation */
import gendiff from '../index.js';
import { readFile, buildPath } from '../src/fileUtils.js';

const getFixturePath = (filename) => buildPath(['__fixtures__', filename]);

const expectedData = {};
const formats = ['stylish', 'plain', 'json'];

beforeAll(() => {
  const complexDataStylish = readFile([getFixturePath('result_stylish.txt')]);
  const complexDataPlain = readFile([getFixturePath('result_plain.txt')]);
  const complexDataJson = readFile([getFixturePath('result_json.json')]);
  expectedData.stylish = complexDataStylish.trim();
  expectedData.plain = complexDataPlain.trim();
  expectedData.json = complexDataJson.trim();
});

test('complex object json format', () => {
  const filePath1 = getFixturePath('file1.json');
  const filePath2 = getFixturePath('file2.json');

  const [stylish] = formats;
  const actual = gendiff(filePath1, filePath2, stylish);
  const expected = expectedData.stylish;
  expect(actual).toEqual(expected);
});

test('complex object yaml format', () => {
  const filePath1 = getFixturePath('file1.yml');
  const filePath2 = getFixturePath('file2.yml');

  const [stylish] = formats;
  const actual = gendiff(filePath1, filePath2, stylish);
  const expected = expectedData.stylish;
  expect(actual).toEqual(expected);
});

test('complex object plain format', () => {
  const filePath1 = getFixturePath('file1.json');
  const filePath2 = getFixturePath('file2.json');

  const [, plain] = formats;
  const actual = gendiff(filePath1, filePath2, plain);
  const expected = expectedData.plain;
  expect(actual).toEqual(expected);
});

test('complex object json format output', () => {
  const filePath1 = getFixturePath('file1.json');
  const filePath2 = getFixturePath('file2.json');

  const [,, json] = formats;
  const actual = gendiff(filePath1, filePath2, json);
  const expected = expectedData.json;
  expect(actual).toEqual(expected);
});
