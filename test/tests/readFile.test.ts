import assert from "assert";
import fs from "fs";
import path from "path";
import { readFile } from "../..";
import { fixturesDir } from "../testUtil";

describe("readFile", () => {
  it("readFile()", () => {
    const file = path.join(fixturesDir, "a");
    const expected = fs.readFileSync(file, "utf8");
    const actual = readFile(file);
    assert.equal(actual, expected);
  });
});
