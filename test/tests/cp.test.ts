import assert from "assert";
import fs from "fs";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { cp } from "../../src";
import { fixturesDir } from "../testUtil";

const source = path.join(fixturesDir, "list", "a");

describe("cp()", () => {
  it("file", () => {
    const content = fs.readFileSync(source, "utf8");
    const destination = path.join(os.tmpdir(), uuidv4());
    const res = cp(source, destination);
    assert.equal(res.path, destination);
    assert.equal(content, fs.readFileSync(destination, "utf8"));
  });

  it("force", () => {
    const content = fs.readFileSync(source, "utf8");
    const destination = path.join(os.tmpdir(), uuidv4());
    cp(source, destination);
    cp(source, destination, { force: true });
    assert.equal(content, fs.readFileSync(destination, "utf8"));
  });

  it("dir", () => {
    const destination = path.join(os.tmpdir(), uuidv4());
    const res = cp(fixturesDir, destination, { recursive: true });
    assert.equal(res.path, destination);
    assert.ok(res.isDir());
  });
});
