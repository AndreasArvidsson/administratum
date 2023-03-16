import fs, { Stats } from "fs";
import glob from "glob";
import os from "os";
import pathlib from "path";

export class Path {
  readonly path: string;

  static home(): Path {
    return new Path(os.homedir());
  }

  static temp(): Path {
    return new Path(os.tmpdir());
  }

  static cwd(): Path {
    return new Path(process.cwd());
  }

  static sep(): string {
    return pathlib.sep;
  }

  static oldPWD(): Path {
    if (!process.env.OLDPWD) {
      throw Error("Could not find previous directory");
    } else {
      return new Path(process.env.OLDPWD);
    }
  }

  constructor(path: Path | string) {
    this.path = path instanceof Path ? path.path : pathlib.resolve(path);
  }

  get name(): string {
    return pathlib.basename(this.path);
  }

  get ext(): string {
    return pathlib.extname(this.path);
  }

  exists(): boolean {
    return fs.existsSync(this.path);
  }

  isFile(): boolean {
    return this.stats().isFile();
  }

  isDir(): boolean {
    return this.stats().isDirectory();
  }

  size(): number {
    return this.stats().size;
  }

  stats(): Stats {
    return fs.statSync(this.path);
  }

  equals(path: Path): boolean {
    return this.path === path.path;
  }

  toString(): string {
    return this.path;
  }

  join(...sub: string[]): Path {
    return new Path(pathlib.join(this.path, ...sub));
  }

  dir(): Path {
    return new Path(pathlib.dirname(this.path));
  }

  relative(path: Path | string): string {
    return pathlib.relative(this.path, path instanceof Path ? path.path : path);
  }

  files(): Path[] {
    return fs
      .readdirSync(this.path)
      .sort()
      .map((f) => this.join(f));
  }

  glob(pattern: string): Path[] {
    return glob
      .globSync(pattern, { cwd: this.path })
      .map((f) => new Path(pathlib.join(this.path, f)));
  }
}

export const getCtime = (path: Path) => {
  return path.stats().ctime;
};
