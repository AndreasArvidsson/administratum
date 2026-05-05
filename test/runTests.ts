import { exit } from "node:process";
import fastGlob from "fast-glob";
import Mocha from "mocha";
import { testsDir } from "./testUtil.js";

const mocha = new Mocha({
    color: true,
    // grep: /exists/,
});

const files = fastGlob
    .sync("**/**.test.ts", { cwd: testsDir, absolute: true })
    .toSorted();

for (const file of files) {
    mocha.addFile(file);
}

mocha.run((failures) => {
    if (failures > 0) {
        exit(1);
    }
});
