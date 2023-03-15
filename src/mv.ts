import fs from "fs";
import path from "path";

interface Options {
  force?: boolean;
}

export const mv = async (
  source: string,
  destination: string,
  options: Options = {}
) => {
  const src = path.resolve(source);
  const dest = path.resolve(destination);

  if (src === dest) {
    throw Error(`Can't move to self: '${src}'`);
  }

  if (!fs.existsSync(src)) {
    throw Error(`No such file or directory: '${src}'`);
  }

  if (fs.existsSync(dest)) {
    const stats = fs.statSync(dest);
    if (stats.isFile() && !options.force) {
      throw Error(`Destination file already exists: '${dest}'`);
    }
  }

  fs.renameSync(src, dest);

  return dest;
};
