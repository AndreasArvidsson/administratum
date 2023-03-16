import assert from "assert";
import { $ } from "../..";

describe("shell()", () => {
  it("time", () => {
    const res = $("time /t");
    assert.ok(/\d{2}:\d{2}/.test(res));
  });
});
