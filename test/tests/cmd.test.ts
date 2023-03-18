import assert from "assert";
import { $, $$, Options } from "../../src/cmd";

const options: Options = { stdout: "ignore" };

describe("cmd", () => {
  it("$ time", () => {
    const res = $("time /t", options);
    console.log(res);
    assert.ok(/\d{2}:\d{2}/.test(res));
  });

  it("$ sync", () => {
    const res = $("echo hello there", options);
    assert.ok(/hello there/.test(res));
  });

  it("$ async", async () => {
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
});
