import type { Stats } from "node:fs";
import fs from "node:fs";
import os from "node:os";
import pathlib from "node:path";

export class Path {
    public readonly path: string;

    public static home(): Path {
        return new Path(os.homedir());
    }

    public static temp(): Path {
        return new Path(os.tmpdir());
    }

    public static cwd(): Path {
        return new Path(process.cwd());
    }

    public static sep(): string {
        return pathlib.sep;
    }

    public static oldPWD(): Path | undefined {
        if (process.env.OLDPWD == null) {
            return undefined;
        }
        return new Path(process.env.OLDPWD);
    }

    public constructor(path: Path | string) {
        this.path = path instanceof Path ? path.path : pathlib.resolve(path);
    }

    public get name(): string {
        return pathlib.basename(this.path);
    }

    public get ext(): string {
        return pathlib.extname(this.path);
    }

    public exists(): boolean {
        return fs.existsSync(this.path);
    }

    public isFile(): boolean {
        return this.stats().isFile();
    }

    public isDir(): boolean {
        return this.stats().isDirectory();
    }

    public size(): number {
        return this.stats().size;
    }

    public stats(): Stats {
        return fs.statSync(this.path);
    }

    public equals(path: Path): boolean {
        return this.path === path.path;
    }

    public toString(): string {
        return this.path;
    }

    public join(...paths: string[]): Path {
        return new Path(pathlib.join(this.path, ...paths));
    }

    public dir(): Path {
        return new Path(pathlib.dirname(this.path));
    }

    public relative(path: Path | string): string {
        return pathlib.relative(
            this.path,
            path instanceof Path ? path.path : path,
        );
    }

    public files(name?: RegExp): Path[] {
        let fileNames = fs.readdirSync(this.path);
        if (name) {
            fileNames = fileNames.filter((f) => name.test(f));
        }
        return fileNames.toSorted().map((f) => this.join(f));
    }
}

export function getCtime(path: Path): Date {
    return path.stats().ctime;
}
