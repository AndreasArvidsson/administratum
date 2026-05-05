import { Path } from "./Path.js";
import type { OptionsType } from "./util/Arguments.js";
import { getOptions } from "./util/Arguments.js";

const optionsMap = {
    f: "files",
    d: "directories",
} as const;

type Options = OptionsType<typeof optionsMap, 2>;

export function find(
    path: Path | string,
    name?: RegExp | null,
    options: Options = {},
): Path[] {
    path = new Path(path);
    const opts = getOptions(options, optionsMap);

    const [includeDirectories, includeFiles] = (() => {
        if (opts.directories == null && opts.files == null) {
            return [true, true];
        }
        return [Boolean(opts.directories), Boolean(opts.files)];
    })();

    if (!path.exists()) {
        throw new Error(`No such file or directory: '${path.path}'`);
    }

    function findFile(file: Path): Path[] {
        const matched = name ? name.test(file.name) : true;

        if (file.isDir()) {
            const children = file.files().flatMap((f) => findFile(f));

            if (matched && includeDirectories) {
                return [file, ...children];
            }

            return children;
        }

        if (matched && includeFiles) {
            return [file];
        }

        return [];
    }

    return findFile(path);
}

export function findStr(
    path: string,
    name?: RegExp | null,
    options: Options = {},
): string {
    const root = Path.cwd();
    return find(path, name, options)
        .map((f) => root.relative(f))
        .join("\n");
}
