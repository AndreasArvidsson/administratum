import fs from "node:fs";
import { Path } from "./Path.js";
import type { OptionsType } from "./util/Arguments.js";
import { getOptions } from "./util/Arguments.js";

const optionsMap = {
    f: "force",
} as const;

type Options = OptionsType<typeof optionsMap, 1>;

export function mv(
    source: Path | string,
    destination: Path | string,
    options: Options = {},
): Path {
    source = new Path(source);
    destination = new Path(destination);
    const opts = getOptions(options, optionsMap);

    if (source.equals(destination)) {
        throw new Error(`Can't move to self: '${source.path}'`);
    }

    if (!source.exists()) {
        throw new Error(`No such file or directory: '${source.path}'`);
    }

    if (destination.exists()) {
        if (destination.isFile()) {
            if (!opts.force) {
                throw new Error(
                    `Destination file already exists: '${destination.path}'`,
                );
            }
        } else {
            destination = destination.join(source.name);
        }
    }

    fs.renameSync(source.path, destination.path);

    return destination;
}
