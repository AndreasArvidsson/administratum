import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { readFile, readFileByline } from "../../src";
import { fixturesDir } from "../testUtil";

describe("readFile", () => {
    it("readFile()", () => {
        const file = path.join(fixturesDir, "list", "a");
        const expected = fs.readFileSync(file, "utf8");
        const actual = readFile(file);
        assert.equal(actual, expected);
    });

    it("readFileByline()", async () => {
        const file = path.join(fixturesDir, "list", "a");
        const expected = fs.readFileSync(file, "utf8");
        const actual: string[] = [];
        for await (const line of readFileByline(file)) {
            actual.push(line);
        }
        assert.equal(actual.join("\n"), expected);
    });
});
