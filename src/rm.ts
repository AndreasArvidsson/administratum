import fs from "node:fs";
import { Path } from "./Path.js";
import type { OptionsType } from "./util/Arguments.js";
import { getOptions } from "./util/Arguments.js";

const optionsMap = {
    r: "recursive",
} as const;

type Options = OptionsType<typeof optionsMap, 1>;

export function rm(path: Path | string, options: Options = {}): Path {
    path = new Path(path);
    const opts = getOptions(options, optionsMap);

    if (!path.exists()) {
        throw new Error(`No such file or directory: '${path.path}'`);
    }

    if (path.isDir()) {
        if (!opts.recursive) {
            throw new Error(`Path is a directory: '${path.path}'`);
        }
    }

    fs.rmSync(path.path, { recursive: true });

    return path;
}
