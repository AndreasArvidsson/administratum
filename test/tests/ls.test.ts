import assert from "node:assert";
import path from "node:path";
import { ls } from "../../src";
import { fixturesDir } from "../testUtil";

const dir = path.join(fixturesDir, "list");

describe("ls", () => {
  it("ls", () => {
    const res = ls(dir);
    assert.equal(res, "a b c");
  });

  it("all", () => {
    const res = ls(dir, { all: true });
    assert.equal(res, ".hidden a b c");
  });

  it("-a", () => {
    const res = ls(dir, "a");
    assert.equal(res, ".hidden a b c");
  });

  it("one", () => {
    const res = ls(dir, { one: true });
    assert.equal(res, "a\nb\nc");
  });

  it("-1", () => {
    const res = ls(dir, "1");
    assert.equal(res, "a\nb\nc");
  });

  it("long", () => {
    const res = ls(dir, { long: true });
    assert.ok(/[a-z-]{9} \d \d \d \d+ \w{3} \d{2} \d{2}:\d{2} \w+/.test(res));
  });

  it("-l", () => {
    const res = ls(dir, "l");
    assert.ok(/[a-z-]{9} \d \d \d \d+ \w{3} \d{2} \d{2}:\d{2} \w+/.test(res));
  });
});
