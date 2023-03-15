import fs from "fs";
import _path from "path";

interface Options {
  recursive?: boolean;
}

export const rm = async (path: string, options: Options = {}) => {
  const src = _path.resolve(path);

  if (!fs.existsSync(src)) {
    throw Error(`No such file or directory: '${src}'`);
  }

  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!options.recursive) {
      throw Error(`Path is directory: '${src}'`);
    }
  }

  fs.rmSync(src, { recursive: true });

  return src;
};
