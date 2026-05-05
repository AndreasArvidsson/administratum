import assert from "node:assert/strict";
import fs from "node:fs";
import { tempFile } from "../../src/tempFile.js";

describe("tempFile", () => {
    it("tempFile()", () => {
        const content = "my\ncontent";
        const res = tempFile(content);
        assert.ok(res.exists());
        assert.equal(fs.readFileSync(res.path, "utf8"), content);
    });
});
