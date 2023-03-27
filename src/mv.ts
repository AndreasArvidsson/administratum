import fs from "node:fs";
import { Path } from ".";
import { OptionsType, getOptions } from "./util/Arguments";

const optionsMap = {
    f: "force",
} as const;

type Options = OptionsType<typeof optionsMap, 1>;

export const mv = (
    source: Path | string,
    destination: Path | string,
    options: Options = {}
): Path => {
    source = new Path(source);
    destination = new Path(destination);
    const opts = getOptions(options, optionsMap);

    if (source.equals(destination)) {
        throw Error(`Can't move to self: '${source.path}'`);
    }

    if (!source.exists()) {
        throw Error(`No such file or directory: '${source.path}'`);
    }

    if (destination.exists()) {
        if (destination.isFile()) {
            if (!opts.force) {
                throw Error(
                    `Destination file already exists: '${destination.path}'`
                );
            }
        } else {
            destination = destination.join(source.name);
        }
    }

    fs.renameSync(source.path, destination.path);

    return destination;
};
