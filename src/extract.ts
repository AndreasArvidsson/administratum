import extractZip from "extract-zip";
import tar from "tar";
import { mkdirs, Path } from ".";

interface Options {
  force?: boolean;
}

function unzip(source: Path, destination: Path): Promise<void> {
  return extractZip(source.path, { dir: destination.path });
}

function untar(source: Path, destination: Path): Promise<void> {
  mkdirs(destination);
  return tar.extract({
    file: source.path,
    cwd: destination.path,
  });
}

export const extract = async (
  source: Path | string,
  destination?: Path | string,
  options: Options = {}
): Promise<Path> => {
  source = new Path(source);
  destination = new Path(destination ?? source.name);

  if (!source.exists) {
    throw Error(`No such file: '${source}'`);
  }

  if (destination.exists()) {
    if (destination.isFile() && !options.force) {
      throw Error(`Destination file already exists: '${destination}'`);
    }
  }

  switch (source.ext) {
    case ".zip":
      await unzip(source, destination);
      break;
    case ".tar":
      await untar(source, destination);
      break;
    default:
      throw new Error(`Unknown archive '${source.ext}'`);
  }

  return destination;
};
