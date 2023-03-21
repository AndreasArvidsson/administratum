import fs from "node:fs";
import readline from "node:readline";
import { Path } from ".";

export const readFile = (file: Path | string): string => {
  file = new Path(file);

  if (!file.exists()) {
    throw Error(`No such file: '${file}'`);
  }

  return fs.readFileSync(file.path, { encoding: "utf8" });
};

export const readFileByline = (file: Path | string) => {
  file = new Path(file);

  if (!file.exists()) {
    throw Error(`No sumch file: '${file}'`);
  }

  const fileStream = fs.createReadStream(file.path);

  return readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
};
