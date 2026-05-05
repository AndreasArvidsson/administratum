import { Path } from "./Path.js";

export function cd(dir?: Path | string): Path {
    if (dir == null) {
        dir = Path.home();
    } else if (dir === "-") {
        dir = Path.oldPWD();
        if (dir == null) {
            throw new Error("Old PWD is undefined");
        }
    } else {
        dir = new Path(dir);
    }

    const curDir = process.cwd();
    process.chdir(dir.path);
    process.env.OLDPWD = curDir;

    return dir;
}
