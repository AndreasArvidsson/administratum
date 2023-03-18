import { $on } from "../../src";
import { Options } from "../../src/cmd/args";

(async () => {
  const cmd = "cmd /q /c countdown.bat";
  // const options: Options = { cwd: __dirname, stdout: "stdout" };
  const options: Options = { cwd: __dirname };
  // const r1 = $(cmd, options);
  // console.log(`1: ${r1}`);
  // const r2 = await $$(cmd, options);
  // console.log(`2: ${r2}`);
  const r3 = await $on(cmd, [], options)
    .on(/even/, (e) => {
      console.log(e.match);
      e.deregister();
      e.on(/DONE/, (e) => {
        console.log(e.match);
      });
    })
    .run();
  // console.log(`3: ${r3}`);
})();
