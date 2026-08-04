import parse from './parser.js';
import buildTree from './buildTree.js';
import getFormatter from './formatters/index.js';

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);

  const tree = buildTree(data1, data2);

  const formatter = getFormatter(formatName);

  return formatter(tree);
};

export default genDiff;
