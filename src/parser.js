import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';

const parse = (filepath) => {
  const extension = path.extname(filepath);

  if (!['.json', '.yaml', '.yml'].includes(extension)) {
    throw new Error(`Unsupported file format: ${extension}`);
  }

  const absolutePath = path.resolve(process.cwd(), filepath);

  const data = fs.readFileSync(absolutePath, 'utf-8');

  if (extension === '.json') {
    return JSON.parse(data);
  }

  return yaml.load(data);
};

export default parse;
