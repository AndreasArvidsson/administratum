import assert from "assert";
import path from "path";
import { grep, grepStr } from "../../src";
import { fixturesDir } from "../testUtil";

const file = path.join(fixturesDir, "list", "a");

describe("grep", () => {
  it("grep()", () => {
    const res = grep(/LOG/, file);
    assert.deepEqual(res, ["LOG 1", "LOG 3"]);
  });

  it("grepStr()", () => {
    const res = grepStr(/LOG/, file);
    assert.equal(res, "LOG 1\nLOG 3");
  });

  it("line number", () => {
    const res = grepStr(/LOG/, file, { lineNumber: true });
    assert.equal(res, "1:\tLOG 1\n3:\tLOG 3");
  });

  it("only matching", () => {
    const res = grepStr(/LOG/, file, { onlyMatching: true });
    assert.equal(res, "LOG\nLOG");
  });

  it("invert match", () => {
    const res = grepStr(/LOG/, file, { invertMatch: true });
    assert.equal(res, "WARN 2");
  });

  it("max count", () => {
    const res = grepStr(/LOG/, file, { maxCount: 1 });
    assert.equal(res, "LOG 1");
  });

  it("count", () => {
    const res = grepStr(/LOG/, file, { count: true });
    assert.equal(res, "2");
  });
});
