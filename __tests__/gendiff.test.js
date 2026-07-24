import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = filename => path.join(__dirname, '__fixtures__', filename);

test('Сравнение плоских файлов JSON', () => {
  const filepath1 = getFixturePath('file1.json');
  const filepath2 = getFixturePath('file2.json');

  const expected = `{
- follow: false
  host: hexlet.io
- proxy: 123.234.53.22
- timeout: 50
+ timeout: 20
+ verbose: true
}`;

  expect(genDiff(filepath1, filepath2)).toBe(expected);
});
