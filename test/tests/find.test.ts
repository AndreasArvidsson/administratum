import assert from "assert";
import path from "path";
import { find, findStr } from "../..";
import { fixtureDir } from "../testUtil";

const files = ["a", "b", "c"];

describe("find", () => {
  it("find()", () => {
    const res = find(fixtureDir);
    // The directory itself plus the 3 files
    assert.equal(res.length, 4);
    assert.deepEqual(
      res.map((f) => f.name),
      ["fixtures", ...files]
    );
  });

  it("findStr()", () => {
    const str = findStr(fixtureDir);
    const lines = [
      ["test", "fixtures"].join(path.sep),
      ...files.map((f) => ["test", "fixtures", f].join(path.sep)),
    ];
    const expected = lines.join("\n");
    assert.equal(str, expected);
  });

  it("name", () => {
    const files = find(fixtureDir, { name: /b/ });
    assert.equal(files.length, 1);
    assert.deepEqual(
      files.map((f) => f.name),
      ["b"]
    );
  });

  it("type: f", () => {
    const files = find(fixtureDir, { type: "f" });
    assert.equal(files.length, 3);
  });

  it("type: d", () => {
    const files = find(fixtureDir, { type: "d" });
    assert.equal(files.length, 1);
  });
});
