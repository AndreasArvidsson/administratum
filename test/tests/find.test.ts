import assert from "assert";
import path from "path";
import { find, findStr } from "../..";
import { fixtureDir } from "../testUtil";

const dir = "fixtures";
const files = ["a", "b", "c"];

describe("find", () => {
  it("find()", () => {
    const res = find(fixtureDir);
    assert.deepEqual(
      res.map((f) => f.name),
      [dir, ...files]
    );
  });

  it("findStr()", () => {
    const res = findStr(fixtureDir);
    const expected = [
      ["test", dir].join(path.sep),
      ...files.map((f) => ["test", dir, f].join(path.sep)),
    ].join("\n");
    assert.equal(res, expected);
  });

  it("name", () => {
    const res = find(fixtureDir, { name: /b/ });
    assert.deepEqual(
      res.map((f) => f.name),
      ["b"]
    );
  });

  it("type: f", () => {
    const res = find(fixtureDir, { type: "f" });
    assert.deepEqual(
      res.map((f) => f.name),
      files
    );
  });

  it("type: d", () => {
    const res = find(fixtureDir, { type: "d" });
    assert.deepEqual(
      res.map((f) => f.name),
      [dir]
    );
  });
});
