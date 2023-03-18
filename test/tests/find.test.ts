import assert from "assert";
import path from "path";
import { find, findStr } from "../../src";
import { fixturesDir } from "../testUtil";

const dir = "fixtures";
const files = [".hidden", "a", "b", "c"];

describe("find", () => {
  it("find()", () => {
    const res = find(fixturesDir);
    assert.deepEqual(
      res.map((f) => f.name),
      [dir, ...files]
    );
  });

  it("findStr()", () => {
    process.chdir(path.join(__dirname, "..", ".."));
    const res = findStr(fixturesDir);
    const expected = [
      ["test", dir].join(path.sep),
      ...files.map((f) => ["test", dir, f].join(path.sep)),
    ].join("\n");
    assert.equal(res, expected);
  });

  it("name", () => {
    const res = find(fixturesDir, { name: /b/ });
    assert.deepEqual(
      res.map((f) => f.name),
      ["b"]
    );
  });

  it("type: f", () => {
    const res = find(fixturesDir, { type: "f" });
    assert.deepEqual(
      res.map((f) => f.name),
      files
    );
  });

  it("type: d", () => {
    const res = find(fixturesDir, { type: "d" });
    assert.deepEqual(
      res.map((f) => f.name),
      [dir]
    );
  });
});
