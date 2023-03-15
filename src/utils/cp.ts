import fs from "fs";
import path from "path";

interface Options {
  recursive?: boolean;
  force?: boolean;
}

export const cp = async (
  source: string,
  destination: string,
  options: Options = {}
) => {
  source = path.resolve(source);
  destination = path.resolve(destination);

  if (source === destination) {
    throw Error(`Can't copy to self: '${source}'`);
  }

  if (!fs.existsSync(source)) {
    throw Error(`No such file or directory: '${source}'`);
  }

  const stats = fs.statSync(source);
  if (stats.isDirectory()) {
    if (!options.recursive) {
      throw Error(`Source is a directory: '${source}'`);
    }
  }

  fs.cpSync(source, destination, {
    errorOnExist: true,
    recursive: true,
    force: options.force ?? false,
  });

  return destination;
};
