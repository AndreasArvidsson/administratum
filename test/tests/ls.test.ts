import assert from "assert";
import { ls } from "../..";
import { fixturesDir } from "../testUtil";

describe.only("ls", () => {
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

  it.only("long", () => {
    const res = ls(fixturesDir, { long: true });
    console.log(res);
    assert.equal(res, "a b c");
  });
});
