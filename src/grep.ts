import fs from "fs";
import path from "path";

interface Options {
  lineNumber?: boolean;
  onlyMatching?: boolean;
  invertMatch?: boolean;
  maxCount?: number;
  count?: boolean;
}

export const grep = async (
  regex: RegExp,
  file: string,
  options: Options = {}
) => {
  file = path.resolve(file);

  if (!fs.existsSync(file)) {
    throw Error(`No such file : '${file}'`);
  }

  const stats = fs.statSync(file);
  if (stats.isDirectory()) {
    throw Error(`File is a directory: '${file}'`);
  }

  const result: string[] = [];

  const lines = fs.readFileSync(file, "utf8").split("\n");

  if (options.count) {
    const count =
      options.maxCount != null
        ? Math.min(options.maxCount, lines.length)
        : lines.length;
    return count.toString();
  }

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

  return result.join("\n");
};
