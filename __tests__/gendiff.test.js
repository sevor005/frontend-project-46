import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';
import stylish from '../src/formatters/stylish.js';
import plain from '../src/formatters/plain.js';
import { FORMATTER, FORMAT } from './../src/utils.js';

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

const expectedJson = `[
  {
    "key": "common",
    "type": "nested",
    "children": [
      {
        "key": "follow",
        "type": "added",
        "value": false
      },
      {
        "key": "setting1",
        "type": "unchanged",
        "value": "Value 1"
      },
      {
        "key": "setting2",
        "type": "removed",
        "value": 200
      },
      {
        "key": "setting3",
        "type": "changed",
        "oldValue": true,
        "newValue": null
      },
      {
        "key": "setting4",
        "type": "added",
        "value": "blah blah"
      },
      {
        "key": "setting5",
        "type": "added",
        "value": {
          "key5": "value5"
        }
      },
      {
        "key": "setting6",
        "type": "nested",
        "children": [
          {
            "key": "doge",
            "type": "nested",
            "children": [
              {
                "key": "wow",
                "type": "changed",
                "oldValue": "",
                "newValue": "so much"
              }
            ]
          },
          {
            "key": "key",
            "type": "unchanged",
            "value": "value"
          },
          {
            "key": "ops",
            "type": "added",
            "value": "vops"
          }
        ]
      }
    ]
  },
  {
    "key": "group1",
    "type": "nested",
    "children": [
      {
        "key": "baz",
        "type": "changed",
        "oldValue": "bas",
        "newValue": "bars"
      },
      {
        "key": "foo",
        "type": "unchanged",
        "value": "bar"
      },
      {
        "key": "nest",
        "type": "changed",
        "oldValue": {
          "key": "value"
        },
        "newValue": "str"
      }
    ]
  },
  {
    "key": "group2",
    "type": "removed",
    "value": {
      "abc": 12345,
      "deep": {
        "id": 45
      }
    }
  },
  {
    "key": "group3",
    "type": "added",
    "value": {
      "deep": {
        "id": {
          "number": 45
        }
      },
      "fee": 100500
    }
  }
]`;

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

const formats = [
  [FORMATTER.STYLISH, expectedStylish],
  [FORMATTER.PLAIN, expectedPlain],
  [FORMATTER.JSON, expectedJson],
];

test.each(formats)('Сравнение файлов в формате %s', (format, expected) => {
  const { filepath1, filepath2 } = createFixturePaths(FORMAT.YAML);

  expect(genDiff(filepath1, filepath2, format)).toBe(expected);
});

test.each([
  [FORMAT.YAML],
  [FORMAT.JSON],
])('JSON формат для файлов %s', (extension) => {
  const { filepath1, filepath2 } = createFixturePaths(extension);

  expect(genDiff(filepath1, filepath2, FORMAT.JSON)).toBe(expectedJson);
});

test.each([
  [FORMATTER.STYLISH, stylish],
  [FORMATTER.PLAIN, plain],
])('Формат %s: неизвестный тип узла вызывает ошибку', (_, formatter) => {
  const tree = [
    {
      key: 'test',
      type: 'unknown',
      value: 'value',
    },
  ];

  expect(() => formatter(tree))
    .toThrow('Unknown node type: unknown');
});

test('Передача неизвестного форматтера', () => {
  const { filepath1, filepath2 } = createFixturePaths(FORMAT.YAML);

  expect(() => genDiff(filepath1, filepath2, FORMAT.XML))
    .toThrow(`Unknown format: ${FORMAT.XML}`);
});

test('Передача недопустимого формата', () => {
  expect(() => genDiff('file1.j')).toThrow('Unsupported file format: .j');
});
