import { isObject, STATUSES } from '../utils.js';

const stringify = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }

  return String(value);
};

const plain = (tree, path = []) => {
  const lines = tree.flatMap((node) => {
    const {
      key,
      type,
      value,
      oldValue,
      newValue,
      children,
    } = node;

    const currentPath = [...path, key].join('.');

    switch (type) {
      case STATUSES.ADDED:
        return `Property '${currentPath}' was added with value: ${stringify(value)}`;

      case STATUSES.REMOVED:
        return `Property '${currentPath}' was removed`;

      case STATUSES.CHANGED:
        return `Property '${currentPath}' was updated. From ${stringify(oldValue)} to ${stringify(newValue)}`;

      case STATUSES.NESTED:
        return plain(children, [...path, key]);

      case STATUSES.UNCHANGED:
        return [];

      default:
        throw new Error(`Unknown node type: ${type}`);
    }
  });

  return lines.join('\n');
};

export default plain;
