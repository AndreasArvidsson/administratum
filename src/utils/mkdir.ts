import fs from "fs";

export const mkdir = (path: string) => {
  return fs.promises.mkdir(path);
};

export const mkdirs = (path: string) => {
  return fs.promises.mkdir(path, { recursive: true });
};
