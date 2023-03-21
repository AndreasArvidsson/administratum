import fs from "node:fs";
import { Path } from ".";

export const touch = (path: Path | string): Path => {
  path = new Path(path);

  if (path.exists()) {
    if (path.isDir()) {
      throw Error(`Path is directory: '${path}'`);
    }
  }

  fs.closeSync(fs.openSync(path.path, "a"));

  const now = new Date();
  fs.utimesSync(path.path, now, now);

  return path;
};
