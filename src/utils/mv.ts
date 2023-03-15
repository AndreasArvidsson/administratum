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
  source = path.resolve(source);
  destination = path.resolve(destination);

  if (source === destination) {
    throw Error(`Can't move to self: '${source}'`);
  }

  if (!fs.existsSync(source)) {
    throw Error(`No such file or directory: '${source}'`);
  }

  if (fs.existsSync(destination)) {
    const stats = fs.statSync(destination);
    if (stats.isFile() && !options.force) {
      throw Error(`Destination file already exists: '${destination}'`);
    }
  }

  fs.renameSync(source, destination);

  return destination;
};
