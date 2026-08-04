import { isObject, STATUSES } from '../utils.js';

const indentSize = 4;
const shift = 2;

const makeIndent = (depth, sign = ' ') => `${' '.repeat(depth * indentSize - shift)}${sign} `;

const stringify = (value, depth) => {
  if (!isObject(value)) return String(value);

  const lines = Object.entries(value)
    .map(([key, val]) => `${makeIndent(depth + 1)}${key}: ${stringify(val, depth + 1)}`);

  return [
    '{',
    ...lines,
    `${' '.repeat(depth * indentSize)}}`,
  ].join('\n');
};

const stylish = (tree, depth = 1) => {
  const lines = tree.flatMap((node) => {
    const {
      key,
      type,
      value,
      oldValue,
      newValue,
      children,
    } = node;

    switch (type) {
      case STATUSES.ADDED:
        return `${makeIndent(depth, '+')}${key}: ${stringify(value, depth)}`;

      case STATUSES.REMOVED:
        return `${makeIndent(depth, '-')}${key}: ${stringify(value, depth)}`;

      case STATUSES.UNCHANGED:
        return `${makeIndent(depth)}${key}: ${stringify(value, depth)}`;

      case STATUSES.CHANGED:
        return [
          `${makeIndent(depth, '-')}${key}: ${stringify(oldValue, depth)}`,
          `${makeIndent(depth, '+')}${key}: ${stringify(newValue, depth)}`,
        ];

      case STATUSES.NESTED:
        return `${makeIndent(depth)}${key}: ${stylish(children, depth + 1)}`;

      default:
        throw new Error(`Unknown node type: ${type}`);
    }
  });

  return [
    '{',
    ...lines,
    `${' '.repeat((depth - 1) * indentSize)}}`,
  ].join('\n');
};

export default stylish;
