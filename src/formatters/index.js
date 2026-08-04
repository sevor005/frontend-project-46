import stylish from './stylish.js';
import plain from './plain.js';

const formatters = {
  stylish,
  plain,
};

const getFormatter = (formatName = 'stylish') => {
  if (!Object.hasOwn(formatters, formatName)) {
    throw new Error(`Unknown format: ${formatName}`);
  }

  return formatters[formatName];
};

export default getFormatter;
