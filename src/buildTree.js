import { isObject, STATUSES } from './utils.js';

const buildTree = (data1, data2) => {
  const keys = [...new Set([
    ...Object.keys(data1),
    ...Object.keys(data2),
  ])].sort();

  return keys.map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (!Object.hasOwn(data1, key)) {
      return { key, type: STATUSES.ADDED, value: value2 };
    }

    if (!Object.hasOwn(data2, key)) {
      return { key, type: STATUSES.REMOVED, value: value1 };
    }

    if (isObject(value1) && isObject(value2)) {
      return {
        key,
        type: STATUSES.NESTED,
        children: buildTree(value1, value2),
      };
    }

    if (value1 === value2) {
      return { key, type: STATUSES.UNCHANGED, value: value1 };
    }

    return {
      key,
      type: STATUSES.CHANGED,
      oldValue: value1,
      newValue: value2,
    };
  });
};

export default buildTree;
