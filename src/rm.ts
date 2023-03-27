import fs from "node:fs";
import { Path } from ".";
import { getOptions, OptionsType } from "./util/Arguments";

const optionsMap = {
    r: "recursive",
} as const;

type Options = OptionsType<typeof optionsMap, 1>;

export const rm = (path: Path | string, options: Options = {}): Path => {
    path = new Path(path);
    const opts = getOptions(options, optionsMap);

    if (!path.exists()) {
        throw Error(`No such file or directory: '${path.path}'`);
    }

    if (path.isDir()) {
        if (!opts.recursive) {
            throw Error(`Path is a directory: '${path.path}'`);
        }
    }

    fs.rmSync(path.path, { recursive: true });

    return path;
};
