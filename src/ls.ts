import { Path, range } from ".";

interface Options {
  long?: boolean;
  all?: boolean;
  one?: boolean;
}

export const ls = (path: Path | string, options: Options = {}): string => {
  path = new Path(path);

  if (!path.exists()) {
    throw Error(`No such file or directory: '${path}'`);
  }

  const result: string[] = [];

  // TODO: Proper column spacing

  function addFile(path: Path) {
    if (!options.all && path.name[0] === ".") {
      return;
    }
    if (options.long) {
      result.push(getLongLine(path));
    } else {
      result.push(path.name);
    }
  }

  if (path.isDir()) {
    path.files().forEach(addFile);
  } else {
    addFile(path);
  }

  const res = result.join(options.long || options.one ? "\n" : " ");
  // TODO: total should be size!
  // return options.long ? `total ${result.length}\n${res}` : res;
  return res;
};

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

function formatDate(d: Date) {
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

function pad(num: number) {
  return num.toString().padStart(2, "0");
}

function getPermissions(mode: number): string {
  const str = mode.toString(8);
  return range(1, 4)
    .map((i) => getPermission(str.at(-i)!))
    .join("");
}

function getPermission(char: string): string {
  const num = parseInt(char);
  const r = (num & 4) !== 0;
  const w = (num & 2) !== 0;
  const x = (num & 1) !== 0;
  return `${r ? "r" : ""}${w ? "w" : ""}${x ? "x" : "-"}`;
}
