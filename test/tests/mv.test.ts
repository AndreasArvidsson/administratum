import assert from "assert";
import fs from "fs";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { mv, tempFile } from "../../src";

const content = "my\ncontent";

describe("mv()", () => {
  it("file => file", () => {
    const source = tempFile(content);
    const destination = path.join(os.tmpdir(), uuidv4());
    const res = mv(source, destination);
    assert.equal(res.path, destination);
    assert.equal(content, fs.readFileSync(res.path, "utf8"));
    assert.ok(!source.exists());
  });

  it("file => dir", () => {
    const source = tempFile(content);
    const destination = path.join(os.tmpdir(), uuidv4());
    fs.mkdirSync(destination);
    const res = mv(source, destination);
    assert.equal(content, fs.readFileSync(res.path, "utf8"));
    assert.ok(!source.exists());
  });

  it("file force", () => {
    const source = tempFile(content);
    const destination = tempFile(content);
    const res = mv(source, destination, { force: true });
    assert.equal(res.path, destination.path);
    assert.equal(content, fs.readFileSync(res.path, "utf8"));
    assert.ok(!source.exists());
  });

  it("dir => dir", () => {
    const source = path.join(os.tmpdir(), uuidv4());
    const destination = path.join(os.tmpdir(), uuidv4());
    fs.mkdirSync(source);
    fs.mkdirSync(destination);
    const res = mv(source, destination);
    assert.ok(res.isDir());
    assert.ok(!fs.existsSync(source));
  });
});
