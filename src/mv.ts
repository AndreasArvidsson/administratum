import fs from "fs";
import { Path } from ".";

interface Options {
  force?: boolean;
}

export const mv = (
  source: Path | string,
  destination: Path | string,
  options: Options = {}
): Path => {
  source = new Path(source);
  destination = new Path(destination);

  if (source.equals(destination)) {
    throw Error(`Can't move to self: '${source}'`);
  }

  if (!source.exists()) {
    throw Error(`No such file or directory: '${source}'`);
  }

  if (destination.exists()) {
    if (destination.isFile()) {
      if (!options.force) {
        throw Error(`Destination file already exists: '${destination}'`);
      }
    } else {
      destination = destination.join(source.name);
    }
  }

  fs.renameSync(source.path, destination.path);

  return destination;
};
