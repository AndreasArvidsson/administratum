import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { writeFile } from "../../src";

describe("writeFile", () => {
    it("writeFile(string)", () => {
        const file = path.join(os.tmpdir(), uuidv4());
        const expected = "Some content";
        writeFile(file, expected);
        const actual = fs.readFileSync(file, "utf8");
        assert.equal(actual, expected);
    });

    it("writeFile(object)", () => {
        const file = path.join(os.tmpdir(), uuidv4());
        writeFile(file, { value: 5 });
        const expected = '{\n    "value": 5\n}';
        const actual = fs.readFileSync(file, "utf8");
        assert.equal(actual, expected);
    });
});
