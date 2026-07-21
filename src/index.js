import parse from './parser.js';

export default function genDiff(filepath1, filepath2) {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);

  console.log(data1);
  console.log(data2);

  return '';
}
