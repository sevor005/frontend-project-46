import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';
import stylish from '../src/formatters/stylish.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = filename => path.join(__dirname, '__fixtures__', filename);

const createFixturePaths = extension => ({
  filepath1: getFixturePath(`file1.${extension}`),
  filepath2: getFixturePath(`file2.${extension}`),
});

const expected = `{
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

test(`Сравнение вложенных файлов .yaml`, () => {
  const { filepath1, filepath2 } = createFixturePaths('yaml');

  expect(genDiff(filepath1, filepath2)).toBe(expected);
});

test('Неизвестный тип узла вызывает ошибку', () => {
  const tree = [
    {
      key: 'test',
      type: 'unknown',
      value: 'value',
    },
  ];

  expect(() => stylish(tree)).toThrow('Unknown node type: unknown');
});

test('Передача недопустимого формата', () => {
  expect(() => genDiff('file1.j')).toThrow('Unsupported file format: .j');
});
