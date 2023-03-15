import util from "util";
import childProcess from "child_process";

export const $ = util.promisify(childProcess.exec);
