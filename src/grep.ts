import { Path, readFile } from ".";
import { getOptions, OptionsFlags, OptionsObject } from "./util/Arguments";

const optionsMap = {
  n: "lineNumber",
  o: "onlyMatching",
  v: "invertMatch",
  c: "count",
} as const;

interface OptionsObj extends OptionsObject<typeof optionsMap> {
  maxCount?: number;
}

type Options = OptionsObj | OptionsFlags<typeof optionsMap, 4>;

export const grep = (
  regex: RegExp,
  file: Path | string,
  options: Options = {}
): string[] => {
  file = new Path(file);
  const opts = getOptions(options, optionsMap) as OptionsObj;

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
      if (opts.invertMatch) {
        continue;
      }
      if (opts.onlyMatching) {
        lineRes = match[0];
      } else {
        lineRes = line;
      }
    } else {
      if (!opts.invertMatch) {
        continue;
      }
      if (opts.onlyMatching) {
        continue;
      } else {
        lineRes = line;
      }
    }

    if (opts.lineNumber) {
      lineRes = `${i + 1}:\t${lineRes}`;
    }

    result.push(lineRes);

    if (opts.maxCount != null && opts.maxCount === result.length) {
      break;
    }
  }

  if (opts.count) {
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
