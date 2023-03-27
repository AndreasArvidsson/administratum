import assert from "node:assert";
import os from "node:os";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { mkdir, mkdirs } from "../../src";

describe("mkdir", () => {
    it("mkdir()", () => {
        const expected = path.join(os.tmpdir(), uuidv4());
        const res = mkdir(expected);
        assert.equal(res, expected);
        assert.ok(res.isDir());
    });

    it("mkdirs()", () => {
        const expected = path.join(os.tmpdir(), uuidv4(), "sub");
        const res = mkdirs(expected);
        assert.equal(res, expected);
        assert.ok(res.isDir());
    });
});
