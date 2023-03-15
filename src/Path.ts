import glob from "glob";
import os from "os";
import pathlib from "path";
import { mkdirs } from "./mkdir";
import { mv } from "./mv";
import fs from "fs";

export type PathLike = Path | string;

export class Path {
  readonly path: string;

  static home(): Path {
    return new Path(os.homedir());
  }

  constructor(path: PathLike) {
    this.path = pathString(path);
  }

  get name(): string {
    return pathlib.basename(this.path);
  }

  get ext(): string {
    return pathlib.extname(this.path);
  }

  join(...sub: string[]): Path {
    return new Path(pathlib.join(this.path, ...sub));
  }

  dir(): Path {
    return new Path(pathlib.dirname(this.path));
  }

  to(path: string): Path {
    return new Path(pathlib.relative(this.path, path));
  }

  from(path: string): Path {
    return new Path(pathlib.relative(path, this.path));
  }

  glob(pattern: string): Path[] {
    return glob
      .globSync(pattern, { cwd: this.path })
      .map((f) => new Path(pathlib.join(this.path, f)));
  }
}

export const getCtime = (path: Path) => {
  return fs.statSync(path.path).ctime;
};

export const pathString = (path: PathLike) => {
  return path instanceof Path ? path.path : pathlib.resolve(path);
};
