import { $, $$, cmdOn, Options } from "../../src";

(async () => {
  const cmd = "cmd /q /c countdown.bat";
  const options: Options = { cwd: __dirname, stdout: "stdout" };
  const r1 = $(cmd, options);
  console.log(`1: ${r1}`);
  const r2 = await $$(cmd, options);
  console.log(`2: ${r2}`);
  const r3 = await cmdOn(cmd, [], options);
  console.log(`3: ${r3}`);
})();
