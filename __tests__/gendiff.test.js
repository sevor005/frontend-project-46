import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';
import stylish from '../src/formatters/stylish.js';
import plain from '../src/formatters/plain.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = filename => path.join(__dirname, '__fixtures__', filename);

const createFixturePaths = extension => ({
  filepath1: getFixturePath(`file1.${extension}`),
  filepath2: getFixturePath(`file2.${extension}`),
});

const expectedStylish = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;

const expectedPlain = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;

test('Сравнение вложенных файлов .yaml в формате plain', () => {
  const { filepath1, filepath2 } = createFixturePaths('yaml');

  expect(genDiff(filepath1, filepath2, 'plain')).toBe(expectedPlain);
});

test('Сравнение вложенных файлов .yaml в формате stylish', () => {
  const { filepath1, filepath2 } = createFixturePaths('yaml');

  expect(genDiff(filepath1, filepath2)).toBe(expectedStylish);
});

test('Формат stylish: неизвестный тип узла вызывает ошибку', () => {
  const tree = [
    {
      key: 'test',
      type: 'unknown',
      value: 'value',
    },
  ];

  expect(() => stylish(tree)).toThrow('Unknown node type: unknown');
});

test('Формат plain: неизвестный тип узла вызывает ошибку', () => {
  const tree = [{
    key: 'test',
    type: 'unknown',
    value: 'value',
  }];

  expect(() => plain(tree)).toThrow('Unknown node type: unknown');
});

test('Передача неизвестного форматтера', () => {
  const { filepath1, filepath2 } = createFixturePaths('yaml');

  expect(() => genDiff(filepath1, filepath2, 'xml'))
    .toThrow('Unknown format: xml');
});

test('Передача недопустимого формата', () => {
  expect(() => genDiff('file1.j')).toThrow('Unsupported file format: .j');
});
