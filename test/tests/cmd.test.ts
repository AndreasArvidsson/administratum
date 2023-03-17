import assert from "assert";
import { $ } from "../../src";

describe("cmd", () => {
  it("$ time", () => {
    const res = $("time /t");
    assert.ok(/\d{2}:\d{2}/.test(res));
  });
});
