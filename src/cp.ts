import fs from "node:fs";
import { Path } from ".";
import { getOptions, OptionsType } from "./util/Arguments";

const optionsMap = {
    r: "recursive",
    f: "force",
} as const;

type Options = OptionsType<typeof optionsMap, 2>;

export const cp = (
    source: Path | string,
    destination: Path | string,
    options: Options = {}
): Path => {
    source = new Path(source);
    destination = new Path(destination);
    const opts = getOptions(options, optionsMap);

    if (source.equals(destination)) {
        throw Error(`Can't copy to self: '${source.path}'`);
    }

    if (!source.exists()) {
        throw Error(`No such file or directory: '${source.path}'`);
    }

    if (source.isDir()) {
        if (!opts.recursive) {
            throw Error(`Source is a directory: '${source.path}'`);
        }
    }

    fs.cpSync(source.path, destination.path, {
        errorOnExist: true,
        recursive: true,
        force: opts.force ?? false,
    });

    return destination;
};
