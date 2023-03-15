import path from "path";
import fs from "fs";
import extractZip from "extract-zip";
import tar from "tar";

interface Options {
  force?: boolean;
}

function unzip(source: string, destination: string) {
  return extractZip(source, { dir: destination });
}

function untar(source: string, destination: string) {
  return tar.extract({
    file: source,
    cwd: destination,
  });
}

export const extract = async (
  source: string,
  destination?: string,
  options: Options = {}
) => {
  source = path.resolve(source);
  destination = path.resolve(destination ?? path.basename(source));
  const ext = path.extname(source);

  if (!fs.existsSync(source)) {
    throw Error(`No such file: '${source}'`);
  }

  if (fs.existsSync(destination)) {
    const stats = fs.statSync(destination);
    if (stats.isFile() && !options.force) {
      throw Error(`Destination file already exists: '${destination}'`);
    }
  }

  switch (ext) {
    case ".zip":
      await unzip(source, destination);
      break;
    case ".tar":
      await untar(source, destination);
      break;
    default:
      throw new Error(`Unknown archive '${ext}'`);
  }

  return destination;
};
