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
  const src = path.resolve(source);
  const dest = path.resolve(destination ?? path.parse(source).name);
  const ext = path.parse(source).ext;

  if (!fs.existsSync(src)) {
    throw Error(`No such file: '${src}'`);
  }

  if (fs.existsSync(dest)) {
    const stats = fs.statSync(dest);
    if (stats.isFile() && !options.force) {
      throw Error(`Destination file already exists: '${dest}'`);
    }
  }

  switch (ext) {
    case ".zip":
      await unzip(src, dest);
      break;
    case ".tar":
      await untar(src, dest);
      break;
    default:
      throw new Error(`Unknown archive '${ext}'`);
  }

  return dest;
};
