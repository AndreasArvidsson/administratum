import childProcess from "child_process";

export const $ = childProcess.execSync;
