import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { appendFile } from "../../src";

describe("appendFile", () => {
    it("appendFile()", () => {
        const file = path.join(os.tmpdir(), uuidv4());
        for (let i = 0; i < 5; ++i) {
            appendFile(file, `${i}`);
        }
        const actual = fs.readFileSync(file, "utf8");
        const expected = "01234";
        assert.equal(actual, expected);
    });
});
