import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { cp } from "../../src";
import { fixturesDir } from "../testUtil";

const source = path.join(fixturesDir, "list", "a");

describe("cp()", () => {
    it("file", () => {
        const content = fs.readFileSync(source, "utf8");
        const destination = path.join(os.tmpdir(), uuidv4());
        const res = cp(source, destination);
        assert.equal(res.path, destination);
        assert.equal(content, fs.readFileSync(destination, "utf8"));
    });

    it("force", () => {
        const content = fs.readFileSync(source, "utf8");
        const destination = path.join(os.tmpdir(), uuidv4());
        cp(source, destination, { force: true });
        assert.equal(content, fs.readFileSync(destination, "utf8"));
    });

    it("-f", () => {
        const content = fs.readFileSync(source, "utf8");
        const destination = path.join(os.tmpdir(), uuidv4());
        cp(source, destination, "f");
        assert.equal(content, fs.readFileSync(destination, "utf8"));
    });

    it("recursive", () => {
        const destination = path.join(os.tmpdir(), uuidv4());
        const res = cp(fixturesDir, destination, { recursive: true });
        assert.equal(res.path, destination);
        assert.ok(res.isDir());
    });

    it("-r", () => {
        const destination = path.join(os.tmpdir(), uuidv4());
        const res = cp(fixturesDir, destination, "r");
        assert.equal(res.path, destination);
        assert.ok(res.isDir());
    });
});
