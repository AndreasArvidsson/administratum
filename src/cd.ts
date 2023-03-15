import os from "os";

export const cd = (dir: string) => {
  if (!dir) {
    dir = os.homedir();
  }

  if (dir === "-") {
    if (!process.env.OLDPWD) {
      throw Error("Could not find previous directory");
    } else {
      dir = process.env.OLDPWD;
    }
  }

  const curDir = process.cwd();
  process.chdir(dir);
  process.env.OLDPWD = curDir;
};
