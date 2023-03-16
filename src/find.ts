import fs from "fs";
import { Path } from ".";

interface Options {
  type?: "d" | "f";
  name?: RegExp;
}

export const find = (path: Path | string, options: Options = {}): Path[] => {
  path = new Path(path);
  const root = Path.cwd();

  if (!path.exists()) {
    throw Error(`No such file or directory: '${path}'`);
  }

  function findFile(file: Path, options: Options): Path[] {
    const matched = options.name ? options.name.test(file.name) : true;

    if (file.isDir()) {
      const children = file.files().flatMap((f) => findFile(f, options));

      if (matched && options.type !== "f") {
        return [root.relative(file), ...children];
      }

      return children;
    }

    if (matched && options.type !== "d") {
      return [root.relative(file)];
    }

    return [];
  }

  return findFile(path, options);
};

export const findStr = (path: string, options: Options = {}): string => {
  return find(path, options).join("\n");
};
