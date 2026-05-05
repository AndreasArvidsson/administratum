import fs from "node:fs";
import { Path } from "./Path.js";

export function touch(path: Path | string): Path {
    path = new Path(path);

    if (path.exists()) {
        if (path.isDir()) {
            throw new Error(`Path is a directory: '${path.path}'`);
        }
    }

    fs.closeSync(fs.openSync(path.path, "a"));

    const now = new Date();
    fs.utimesSync(path.path, now, now);

    return path;
}
