import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { extract } from "../../src";
import { fixturesDir } from "../testUtil";

const dir = path.join(fixturesDir, "extract");

describe("extract", () => {
    async function testArchive(ext: string) {
        const source = path.join(dir, `a.${ext}`);
        const destination = path.join(os.tmpdir(), uuidv4());
        const res = await extract(source, destination);
        assert.equal(destination, res.path);
        assert.ok(fs.existsSync(path.join(destination, "a")));
    }

    it("zip", () => testArchive("zip"));
    it("tar", () => testArchive("tar"));
    it("tgz", () => testArchive("tgz"));
    it("tar.gz", () => testArchive("tar.gz"));
});
