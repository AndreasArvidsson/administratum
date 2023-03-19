import path from "path";
import { $, $$, $on } from "../src";
import { Options } from "../src/cmd/args";
import { fixturesDir } from "./testUtil";

const options: Options = { cwd: path.join(fixturesDir, "cmd"), timeout: 2500 };
const cmd = "cmd /q /c countdown.bat";

(async () => {
  // const r1 = $(cmd, options);
  // console.log(`1: ${r1}\n`);
  // const r2 = await $$(cmd, options);
  // console.log(`2: ${r2}\n`);
  const r3 = await $on(cmd, [], options)
    .on(/even/, (e) => {
      console.log(e.match);
      e.deregister();
      // e.kill();
      // e.on(/ENTER/, (e) => {
      //   console.log(e.match);
      //   e.write("\n");
      // });
    })
    .run();
  console.log(`3: ${r3}`);
})();
