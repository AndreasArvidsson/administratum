import assert from "assert";
import { ls } from "../../src";
import { fixturesDir } from "../testUtil";

describe("ls", () => {
  it("ls", () => {
    const res = ls(fixturesDir);
    assert.equal(res, "a b c");
  });

  it("all", () => {
    const res = ls(fixturesDir, { all: true });
    assert.equal(res, ".hidden a b c");
  });

  it("one", () => {
    const res = ls(fixturesDir, { one: true });
    assert.equal(res, "a\nb\nc");
  });

  it("long", () => {
    const res = ls(fixturesDir, { long: true });
    assert.ok(/[a-z-]{9} \d \d \d \d+ \w{3} \d{2} \d{2}:\d{2} \w+/.test(res));
  });
});
