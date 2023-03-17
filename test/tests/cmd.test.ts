import assert from "assert";
import { $ } from "../..";

describe("cmd", () => {
  it("$ time", () => {
    const res = $("time /t");
    assert.ok(/\d{2}:\d{2}/.test(res));
  });

  it("$ cmd", () => {
    const res = $("echo hello there");
    assert.ok(/hello there/.test(res));
  });

  it("$ file args", () => {
    const res = $("echo", ["hello there"]);
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
