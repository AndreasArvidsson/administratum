import { Path } from ".";
import fs from "fs";

export const readFile = (file: Path | string): string => {
  file = new Path(file);

  if (!file.exists()) {
    throw Error(`No such file: '${file}'`);
  }

  return fs.readFileSync(file.path, { encoding: "utf8" });
};
