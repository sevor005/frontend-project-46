export const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export const STATUSES = {
  ADDED: 'added',
  REMOVED: 'removed',
  UNCHANGED: 'unchanged',
  CHANGED: 'changed',
  NESTED: 'nested',
}

export const FORMATTER = {
  STYLISH: 'stylish',
  PLAIN: 'plain',
  JSON: 'json',
}

export const FORMAT = {
  YAML: 'yaml',
  JSON: 'json',
  XML: 'xml',
}
