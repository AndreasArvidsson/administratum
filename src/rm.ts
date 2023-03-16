import fs from "fs";
import { Path } from ".";

interface Options {
  recursive?: boolean;
}

export const rm = (path: Path | string, options: Options = {}): Path => {
  path = new Path(path);

  if (!path.exists()) {
    throw Error(`No such file or directory: '${path}'`);
  }

  if (path.isDir()) {
    if (!options.recursive) {
      throw Error(`Path is a directory: '${path}'`);
    }
  }

  fs.rmSync(path.path, { recursive: true });

  return path;
};
