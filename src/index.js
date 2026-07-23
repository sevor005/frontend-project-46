import parse from './parser.js';

export default function genDiff(filepath1, filepath2) {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);

  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);

  const nonDuplicateKeys = keys2.filter(key => !keys1.includes(key));

  const keys = [...keys1, ...nonDuplicateKeys].sort();

  const lines = keys.flatMap((key) => {
    const isInFirst = Object.hasOwn(data1, key);
    const isInSecond = Object.hasOwn(data2, key);

    switch (true) {
      case !isInFirst:
        return [`+ ${key}: ${data2[key]}`];

      case !isInSecond:
        return [`- ${key}: ${data1[key]}`];

      case data1[key] === data2[key]:
        return [`  ${key}: ${data1[key]}`];

      default:
        return [
          `- ${key}: ${data1[key]}`,
          `+ ${key}: ${data2[key]}`,
        ];
    }
  });

  return ['{', ...lines, '}'].join('\n');
}
