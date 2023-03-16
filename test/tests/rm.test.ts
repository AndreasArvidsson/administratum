import assert from "assert";
import fs from "fs";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { rm, tempFile } from "../..";

const content = "my\ncontent";

describe("rm()", () => {
  it("file", () => {
    const file = tempFile(content);
    assert.ok(file.exists());
    const res = rm(file);
    assert.equal(file.path, res.path);
    assert.ok(!file.exists());
  });

  it("dir", () => {
    const dir = path.join(os.tmpdir(), uuidv4());
    fs.mkdirSync(dir);
    assert.ok(fs.existsSync(dir));
    const res = rm(dir, { recursive: true });
    assert.equal(dir, res.path);
    assert.ok(!fs.existsSync(dir));
  });
});
