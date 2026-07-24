import fs from 'fs';
import path from 'path';

const parse = (filepath) => {
  const extension = path.extname(filepath);

  if (extension !== '.json') {
    throw new Error(`Unsupported file format: ${extension}`);
  }

  const absolutePath = path.resolve(process.cwd(), filepath);

  const data = fs.readFileSync(absolutePath, 'utf-8');

  return JSON.parse(data);
};

export default parse;
