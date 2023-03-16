import { Path } from ".";

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

  return options.long ? `total ${result.length}\n${res}` : res;
};

function getLongLine(path: Path): string {
  const stats = path.stats();
  return [
    stats.mode.toString(8),
    // https://stackoverflow.com/questions/4087427/python-meaning-of-st-mode
    // https://chmod-calculator.com
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
