import assert from "assert";
import path from "path";
import { $, $$, $on } from "../../src";
import { Options } from "../../src/cmd/args";
import { fixturesDir } from "../testUtil";

const options: Options = { stdout: "ignore" };
const optionsOn: Options = { cwd: path.join(fixturesDir, "cmd") };
const cmdCountdownFast = "cmd /q /c countdownFast.bat";

describe("cmd", () => {
  it("$ time", () => {
    const res = $("time /t", options);
    assert.ok(/\d{2}:\d{2}/.test(res));
  });

  it("$ sync", () => {
    const res = $("echo hello there", options);
    assert.ok(/hello there/.test(res));
  });

  it("$$ async", async () => {
    const res = await $$("echo hello there", options);
    assert.ok(/hello there/.test(res));
  });

  it("$ file args", () => {
    const res = $("echo", ["hello there"], options);
    assert.ok(/hello there/.test(res));
  });

  it("$ error", () => {
    try {
      $("echoo hello");
      assert.fail();
    } catch (error) {
      assert.ok(error instanceof Error);
    }
  });

  it("$on", async () => {
    let count = 0;
    await $on(cmdCountdownFast, optionsOn)
      .on(/even/, () => {
        count += 1;
      })
      .run();
    assert.equal(count, 2);
  });

  it("$on e.deregister()", async () => {
    let count = 0;
    await $on(cmdCountdownFast, optionsOn)
      .on(/even/, (e) => {
        count += 1;
        e.deregister();
      })
      .run();
    assert.equal(count, 1);
  });

  it("$on e.on()", async () => {
    let count = 0;
    await $on(cmdCountdownFast, optionsOn)
      .on(/even/, (e) => {
        count += 1;
        e.on(/DONE/, () => {
          count += 1;
        });
      })
      .run();
    // Each /even/ adds its own /DONE/: 2*2
    assert.equal(count, 4);
  });

  it("$on e.kill()", async () => {
    try {
      await $on(cmdCountdownFast, optionsOn)
        .on(/even/, (e) => e.kill())
        .run();
      assert.fail();
    } catch (error) {
      assert.ok(error instanceof Error);
      assert.ok(error.message.includes("SIGTERM"));
    }
  });

  it("$on e.write()", async () => {
    const res = await $on("cmd /q /c prompt.bat", optionsOn)
      .on(/ENTER/, (e) => e.write("\n"))
      .run();
    assert.equal(res, "Hit ENTER to continue...DONE");
  });
});
