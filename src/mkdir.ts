import fs from "fs";
import { PathLike, pathString } from "./Path";

export const mkdir = (path: PathLike) => {
  path = pathString(path);

  return fs.promises.mkdir(path);
};

export const mkdirs = (path: PathLike) => {
  path = pathString(path);

  return fs.promises.mkdir(path, { recursive: true });
};
