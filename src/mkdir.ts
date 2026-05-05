import fs from "node:fs";
import { Path } from "./Path.js";

export function mkdir(path: Path | string): Path {
    path = new Path(path);

    fs.mkdirSync(path.path);

    return path;
}

export function mkdirs(path: Path | string): Path {
    path = new Path(path);

    fs.mkdirSync(path.path, { recursive: true });

    return path;
}
