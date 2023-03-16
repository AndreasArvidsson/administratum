import fs from "fs";
import { Path, readFile } from ".";

interface Options {
  lineNumber?: boolean;
  onlyMatching?: boolean;
  invertMatch?: boolean;
  maxCount?: number;
  count?: boolean;
}

export const grep = (
  regex: RegExp,
  file: Path | string,
  options: Options = {}
): string[] => {
  file = new Path(file);

  if (!file.exists()) {
    throw Error(`No such file : '${file}'`);
  }

  if (file.isDir()) {
    throw Error(`File is a directory: '${file}'`);
  }

  const lines = readFile(file).split("\n");
  const result: string[] = [];

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    const match = line.match(regex);
    let lineRes;

    if (match) {
      if (options.invertMatch) {
        continue;
      }
      if (options.onlyMatching) {
        lineRes = match[0];
      } else {
        lineRes = line;
      }
    } else {
      if (!options.invertMatch) {
        continue;
      }
      if (options.onlyMatching) {
        continue;
      } else {
        lineRes = line;
      }
    }

    if (options.lineNumber) {
      lineRes = `${i + 1}:\t${lineRes}`;
    }

    result.push(lineRes);

    if (options.maxCount != null && options.maxCount === result.length) {
      break;
    }
  }

  if (options.count) {
    return [result.length.toString()];
  }

  return result;
};

export const grepStr = (
  regex: RegExp,
  file: Path | string,
  options: Options = {}
): string => {
  return grep(regex, file, options).join("\n");
};
