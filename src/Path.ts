import glob from "glob";
import fs, { Stats } from "node:fs";
import os from "node:os";
import pathlib from "node:path";

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

    static oldPWD(): Path | undefined {
        if (!process.env.OLDPWD) {
            return undefined;
        }
        return new Path(process.env.OLDPWD);
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

    join(...paths: string[]): Path {
        return new Path(pathlib.join(this.path, ...paths));
    }

    dir(): Path {
        return new Path(pathlib.dirname(this.path));
    }

    relative(path: Path | string): string {
        return pathlib.relative(this.path, path instanceof Path ? path.path : path);
    }

    files(name?: RegExp): Path[] {
        let fileNames = fs.readdirSync(this.path);
        if (name) {
            fileNames = fileNames.filter((f) => name.test(f));
        }
        return fileNames.sort().map((f) => this.join(f));
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
