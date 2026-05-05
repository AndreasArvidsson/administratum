import { Path } from "./Path.js";
import { readFile } from "./readFile.js";
import type { OptionsFlags, OptionsObject } from "./util/Arguments.js";
import { getOptions } from "./util/Arguments.js";

const optionsMap = {
    n: "lineNumber",
    o: "onlyMatching",
    v: "invertMatch",
    c: "count",
} as const;

interface OptionsObj extends OptionsObject<typeof optionsMap> {
    maxCount?: number;
}

type Options = OptionsObj | OptionsFlags<typeof optionsMap, 4>;

export function grep(
    regex: RegExp,
    file: Path | string,
    options: Options = {},
): string[] {
    file = new Path(file);
    const opts = getOptions(options, optionsMap) as OptionsObj;

    if (!file.exists()) {
        throw new Error(`No such file : '${file.path}'`);
    }

    if (file.isDir()) {
        throw new Error(`File is a directory: '${file.path}'`);
    }

    const lines = readFile(file).split("\n");
    const result: string[] = [];

    for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        const match = line.match(regex);
        let lineRes;

        if (match) {
            if (opts.invertMatch) {
                continue;
            }
            if (opts.onlyMatching) {
                lineRes = match[0];
            } else {
                lineRes = line;
            }
        } else {
            if (!opts.invertMatch) {
                continue;
            }
            if (opts.onlyMatching) {
                continue;
            } else {
                lineRes = line;
            }
        }

        if (opts.lineNumber) {
            lineRes = `${i + 1}:\t${lineRes}`;
        }

        result.push(lineRes);

        if (opts.maxCount != null && opts.maxCount === result.length) {
            break;
        }
    }

    if (opts.count) {
        return [result.length.toString()];
    }

    return result;
}

export function grepStr(
    regex: RegExp,
    file: Path | string,
    options: Options = {},
): string {
    return grep(regex, file, options).join("\n");
}
