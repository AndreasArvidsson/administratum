import fs from "node:fs";
import { Path } from ".";

export const mkdir = (path: Path | string): Path => {
  path = new Path(path);

  fs.mkdirSync(path.path);

  return path;
};

export const mkdirs = (path: Path | string): Path => {
  path = new Path(path);

  fs.mkdirSync(path.path, { recursive: true });

  return path;
};
