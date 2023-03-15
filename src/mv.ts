import fs from "fs";
import path from "path";
import { PathLike, pathString } from "./Path";

interface Options {
  force?: boolean;
}

export const mv = async (
  source: PathLike,
  destination: PathLike,
  options: Options = {}
) => {
  source = pathString(source);
  destination = pathString(destination);

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
    destination = path.join(destination, path.basename(source));
  }

  fs.renameSync(source, destination);

  return destination;
};
