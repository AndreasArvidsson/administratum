import assert from "node:assert";
import path from "node:path";
import { find, findStr } from "../../src";
import { fixturesDir } from "../testUtil";

const dir = path.join(fixturesDir, "list");
const dirName = "list";
const fileNames = [".hidden", "a", "b", "c"];

describe("find", () => {
  it("find()", () => {
    const res = find(dir);
    assert.deepEqual(
      res.map((f) => f.name),
      [dirName, ...fileNames]
    );
  });

  it("findStr()", () => {
    process.chdir(path.dirname(fixturesDir));
    const res = findStr(dir);
    const expected = [
      ["fixtures", dirName].join(path.sep),
      ...fileNames.map((f) => ["fixtures", dirName, f].join(path.sep)),
    ].join("\n");
    assert.equal(res, expected);
  });

  it("name", () => {
    const res = find(dir, { name: /b/ });
    assert.deepEqual(
      res.map((f) => f.name),
      ["b"]
    );
  });

  it("type: f", () => {
    const res = find(dir, { type: "f" });
    assert.deepEqual(
      res.map((f) => f.name),
      fileNames
    );
  });

  it("type: d", () => {
    const res = find(dir, { type: "d" });
    assert.deepEqual(
      res.map((f) => f.name),
      [dirName]
    );
  });
});
