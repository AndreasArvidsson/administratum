import _path from "path";
import fs from "fs";

interface Options {
  long?: boolean;
  all?: boolean;
}

export const ls = async (path: string, options: Options = {}) => {
  path = _path.resolve(path);

  if (!fs.existsSync(path)) {
    throw Error(`No such file or directory: '${path}'`);
  }

  const result: string[] = [];

  function addFile(name: string, abs: string, stat?: fs.Stats) {
    if (!options.all && name[0] === ".") {
      return;
    }
    if (options.long) {
      stat = stat ?? fs.statSync(abs);
      result.push(
        [
          stat.mode,
          stat.nlink,
          stat.uid,
          stat.gid,
          stat.size,
          stat.mtime,
          name,
        ].join(" ")
      );
    } else {
      result.push(name);
    }
  }

  const stats = fs.statSync(path);
  if (stats.isDirectory()) {
    for (const file of fs.readdirSync(path)) {
      addFile(file, _path.join(path, file));
    }
  } else {
    addFile(path, path, stats);
  }

  return result.join(options.long ? "\n" : " ");
};
