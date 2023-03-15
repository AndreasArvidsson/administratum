import fs from "fs";
import _path from "path";

export const mkdir = (path: string) => {
  path = _path.resolve(path);

  return fs.promises.mkdir(path);
};

export const mkdirs = (path: string) => {
  path = _path.resolve(path);

  return fs.promises.mkdir(path, { recursive: true });
};
