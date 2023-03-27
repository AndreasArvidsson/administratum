import assert from "node:assert";
import fs from "node:fs";
import { tempFile } from "../../src";

describe("tempFile", () => {
    it("tempFile()", () => {
        const content = "my\ncontent";
        const res = tempFile(content);
        assert.ok(res.exists());
        assert.equal(fs.readFileSync(res.path, "utf8"), content);
    });
});
