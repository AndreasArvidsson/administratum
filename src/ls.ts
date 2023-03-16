import fs from "fs";
import { Path } from ".";

interface Options {
  long?: boolean;
  all?: boolean;
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
      const stat = fs.statSync(path.path);
      result.push(
        [
          stat.mode,
          stat.nlink,
          stat.uid,
          stat.gid,
          stat.size,
          stat.mtime,
          path.name,
        ].join(" ")
      );
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

  return result.join(options.long ? "\n" : " ");
};
