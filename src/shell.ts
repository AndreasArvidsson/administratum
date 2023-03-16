import childProcess from "child_process";

export const $ = (cmd: string): string => {
  return childProcess.execSync(cmd).toString();
};
