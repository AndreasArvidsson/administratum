import path from "path";

export const pwd = () => {
  return path.resolve(process.cwd());
};
