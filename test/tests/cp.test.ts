import assert from "assert";
import fs from "fs";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { cp } from "../..";
import { fixtureDir } from "../testUtil";

describe.only("cp", () => {
  it("cp file", () => {
    const source = path.join(fixtureDir, "a");
    const content = fs.readFileSync(source, "utf8");
    const destination = path.join(os.tmpdir(), uuidv4());
    const res = cp(source, destination);
    assert.equal(res, destination);
    assert.equal(content, fs.readFileSync(destination, "utf8"));
  });

  it("cp force", () => {
    const source = path.join(fixtureDir, "a");
    const content = fs.readFileSync(source, "utf8");
    const destination = path.join(os.tmpdir(), uuidv4());
    cp(source, destination);
    cp(source, destination, { force: true });
    assert.equal(content, fs.readFileSync(destination, "utf8"));
  });

  it("cp dir", () => {
    const source = fixtureDir;
    const destination = path.join(os.tmpdir(), uuidv4());
    const res = cp(source, destination, { recursive: true });
    assert.equal(res, destination);
  });
});
