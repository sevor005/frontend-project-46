import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testFormats = ['json', 'yaml', 'yml'];

const getFixturePath = filename => path.join(__dirname, '__fixtures__', filename);

const createFixturePaths = extension => ({
  filepath1: getFixturePath(`file1.${extension}`),
  filepath2: getFixturePath(`file2.${extension}`),
});

const expected = fs.readFileSync(getFixturePath('expected.txt'), 'utf-8');

testFormats.forEach((format) => {
  test(`Сравнение вложенных файлов ${format.toUpperCase()}`, () => {
    const { filepath1, filepath2 } = createFixturePaths(format);

    expect(genDiff(filepath1, filepath2)).toBe(expected);
  });
});

test('Передача недопустимого формата', () => {
  expect(() => genDiff('file1.j')).toThrow('Unsupported file format: .j');
});
