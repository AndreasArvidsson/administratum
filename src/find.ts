import _path from "path";
import fs from "fs";

interface Options {
  type?: "d" | "f";
  name?: RegExp;
}

export const find = async (path: string, options: Options = {}) => {
  path = _path.resolve(path);
  const root = _path.resolve(process.cwd());

  if (!fs.existsSync(path)) {
    throw Error(`No such file or directory: '${path}'`);
  }

  function findFile(
    name: string,
    filePath: string,
    options: Options
  ): string[] {
    const matched = options.name ? options.name.test(name) : true;
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const children = fs
        .readdirSync(filePath)
        .flatMap((f) => findFile(f, _path.join(filePath, f), options));

      if (matched && options.type !== "f") {
        return [_path.relative(root, filePath), ...children];
      }

      return children;
    }

    if (matched && options.type !== "d") {
      return [_path.relative(root, filePath)];
    }

    return [];
  }

  return findFile(_path.basename(path), path, options);
};

export const findStr = async (path: string, options: Options = {}) => {
  return (await find(path, options)).join("\n");
};
