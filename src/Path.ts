import glob from "glob";
import os from "os";
import pathlib from "path";
import { mkdirs } from "./mkdir";
import { mv } from "./mv";
import fs from "fs";

export class Path {
  readonly path: string;

  static home(): Path {
    return new Path(os.homedir());
  }

  constructor(path: string) {
    this.path = pathlib.resolve(path);
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

  mkdirs() {
    return mkdirs(this.path);
  }

  move(path: Path) {
    return mv(this.path, path.path);
  }
}

export const getCtime = (path: Path) => {
  return fs.statSync(path.path).ctime;
};
