import fs from 'fs';
import path from 'path';

const parse = (filepath) => {
  const absolutePath = path.resolve(process.cwd(), filepath);

  const data = fs.readFileSync(absolutePath, 'utf-8');

  const extension = path.extname(filepath);

  if (extension === '.json') {
    return JSON.parse(data);
  }

  throw new Error(`Unsupported file format: ${extension}`);
};

export default parse;
