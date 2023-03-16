import { globSync } from "glob";
import Mocha from "mocha";
import path from "path";

const mocha = new Mocha({
  color: true,
});

const cwd = path.join(__dirname, "tests");
const files = globSync("**/**.test.ts", { cwd }).sort();

files.forEach((f) => mocha.addFile(path.resolve(cwd, f)));

mocha.run((failures) => {
  if (failures > 0) {
    new Error(`${failures} tests failed.`);
  }
});
