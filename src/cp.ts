import fs from "fs";
import { Path } from ".";

interface Options {
  recursive?: boolean;
  force?: boolean;
}

export const cp = (
  source: Path | string,
  destination: Path | string,
  options: Options = {}
): Path => {
  source = new Path(source);
  destination = new Path(destination);

  if (source.equals(destination)) {
    throw Error(`Can't copy to self: '${source}'`);
  }

  if (!source.exists()) {
    throw Error(`No such file or directory: '${source}'`);
  }

  if (source.isDir()) {
    if (!options.recursive) {
      throw Error(`Source is a directory: '${source}'`);
    }
  }

  fs.cpSync(source.path, destination.path, {
    errorOnExist: true,
    recursive: true,
    force: options.force ?? false,
  });

  return destination;
};
