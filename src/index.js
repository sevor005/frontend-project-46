import parse from './parser.js';
import buildTree from './buildTree.js';
import stylish from './formatters/stylish.js';

const genDiff = (filepath1, filepath2) => {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);

  const tree = buildTree(data1, data2);

  return stylish(tree);
};

export default genDiff;
