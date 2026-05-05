import fs from "node:fs";
import { Path } from "./Path.js";
import type { OptionsType } from "./util/Arguments.js";
import { getOptions } from "./util/Arguments.js";

const optionsMap = {
    r: "recursive",
    f: "force",
} as const;

type Options = OptionsType<typeof optionsMap, 2>;

export function cp(
    source: Path | string,
    destination: Path | string,
    options: Options = {},
): Path {
    source = new Path(source);
    destination = new Path(destination);
    const opts = getOptions(options, optionsMap);

    if (source.equals(destination)) {
        throw new Error(`Can't copy to self: '${source.path}'`);
    }

    if (!source.exists()) {
        throw new Error(`No such file or directory: '${source.path}'`);
    }

    if (source.isDir()) {
        if (!opts.recursive) {
            throw new Error(`Source is a directory: '${source.path}'`);
        }
    }

    fs.cpSync(source.path, destination.path, {
        errorOnExist: true,
        recursive: true,
        force: opts.force ?? false,
    });

    return destination;
}
