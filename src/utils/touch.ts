import fs from "fs";
import _path from "path";

export const touch = async (path: string) => {
  const file = _path.resolve(path);

  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    if (stats.isDirectory()) {
      throw Error(`Path is directory: '${file}'`);
    }
  }

  fs.closeSync(fs.openSync(file, "a"));

  const now = new Date();
  fs.utimesSync(file, now, now);

  return file;
};
