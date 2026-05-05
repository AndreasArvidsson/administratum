import { Path } from "./Path.js";
import { range } from "./range.js";
import type { OptionsType } from "./util/Arguments.js";
import { getOptions } from "./util/Arguments.js";

const optionsMap = {
    a: "all",
    l: "long",
    "1": "one",
} as const;

type Options = OptionsType<typeof optionsMap, 3>;

export function ls(path: Path | string, options: Options = {}): string {
    path = new Path(path);
    const opts = getOptions(options, optionsMap);

    if (!path.exists()) {
        throw new Error(`No such file or directory: '${path.path}'`);
    }

    const result: string[] = [];

    // TODO: Proper column spacing

    function addFile(path: Path): void {
        if (!opts.all && path.name.startsWith(".")) {
            return;
        }
        if (opts.long) {
            result.push(getLongLine(path));
        } else {
            result.push(path.name);
        }
    }

    if (path.isDir()) {
        for (const file of path.files()) {
            addFile(file);
        }
    } else {
        addFile(path);
    }

    const res = result.join(opts.long || opts.one ? "\n" : " ");
    // TODO: total should be size!
    // return options.long ? `total ${result.length}\n${res}` : res;
    return res;
}

function getLongLine(path: Path): string {
    const stats = path.stats();
    return [
        getPermissions(stats.mode),
        stats.nlink,
        stats.uid,
        stats.gid,
        stats.size,
        formatDate(stats.mtime),
        path.name,
    ].join(" ");
}

function formatDate(d: Date): string {
    const month = months[d.getMonth()];
    const day = pad(d.getDate());
    const hour = pad(d.getHours());
    const minute = pad(d.getMinutes());
    return `${month} ${day} ${hour}:${minute}`;
}

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

function pad(num: number): string {
    return num.toString().padStart(2, "0");
}

function getPermissions(mode: number): string {
    const str = mode.toString(8);
    return range(1, 4)
        .map((i) => {
            const val = str.at(-i);
            return val != null ? getPermission(val) : "";
        })
        .join("");
}

function getPermission(char: string): string {
    const num = Number.parseInt(char, 10);
    // oxlint-disable-next-line no-bitwise
    const r = (num & 4) !== 0;
    // oxlint-disable-next-line no-bitwise
    const w = (num & 2) !== 0;
    // oxlint-disable-next-line no-bitwise
    const x = (num & 1) !== 0;
    return `${r ? "r" : ""}${w ? "w" : ""}${x ? "x" : "-"}`;
}
