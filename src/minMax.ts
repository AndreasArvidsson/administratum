/* eslint-disable @typescript-eslint/no-explicit-any */

interface Options {
  key?: (value: any) => any;
}

export const min = (values: [], options: Options = {}) => {
  const key = options.key ? options.key : (v: any) => v;
  return minMax(values, (a, b) => key(a) < key(b));
};

export const max = (values: any[], options: Options = {}) => {
  const key = options.key ? options.key : (v: any) => v;
  return minMax(values, (a, b) => key(a) > key(b));
};

const minMax = (
  values: any[],
  isPreferred: (prev: any, curr: any) => boolean
) => {
  if (values.length === 0) {
    return undefined;
  }
  return values.reduce(
    (prev, curr) => (isPreferred(prev, curr) ? prev : curr),
    values[0]
  );
};
