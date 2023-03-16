import assert from "assert";
import fs from "fs";
import { tempFile } from "../..";

describe("tempFile", () => {
  it("tempFile()", () => {
    const content = "my\ncontent";
    const res = tempFile(content);
    assert.ok(res.exists());
    assert.equal(fs.readFileSync(res.path), content);
  });
});
