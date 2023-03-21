import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { tempFile, rm } from "../../src";

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
