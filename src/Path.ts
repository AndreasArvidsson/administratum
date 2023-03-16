import fs from "fs";
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
    return fs.statSync(this.path).isFile();
  }

  isDir(): boolean {
    return fs.statSync(this.path).isDirectory();
  }

  size(): number {
    return fs.statSync(this.path).size;
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

  relative(path: Path | string): Path {
    return new Path(
      pathlib.relative(this.path, path instanceof Path ? path.path : path)
    );
  }

  files(): Path[] {
    return fs.readdirSync(this.path).map((f) => this.join(f));
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
