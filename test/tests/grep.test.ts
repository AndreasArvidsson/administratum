import assert from "node:assert";
import path from "node:path";
import { grep, grepStr } from "../../src";
import { fixturesDir } from "../testUtil";

const file = path.join(fixturesDir, "list", "a");

describe("grep", () => {
    it("grep()", () => {
        const res = grep(/LOG/, file);
        assert.deepEqual(res, ["LOG 1", "LOG 3"]);
    });

    it("grepStr()", () => {
        const res = grepStr(/LOG/, file);
        assert.equal(res, "LOG 1\nLOG 3");
    });

    it("lineNumber", () => {
        const res = grepStr(/LOG/, file, { lineNumber: true });
        assert.equal(res, "1:\tLOG 1\n3:\tLOG 3");
    });

    it("-n", () => {
        const res = grepStr(/LOG/, file, "n");
        assert.equal(res, "1:\tLOG 1\n3:\tLOG 3");
    });

    it("onlyMatching", () => {
        const res = grepStr(/LOG/, file, { onlyMatching: true });
        assert.equal(res, "LOG\nLOG");
    });

    it("-o", () => {
        const res = grepStr(/LOG/, file, "o");
        assert.equal(res, "LOG\nLOG");
    });

    it("invertMatch", () => {
        const res = grepStr(/LOG/, file, { invertMatch: true });
        assert.equal(res, "WARN 2");
    });

    it("-v", () => {
        const res = grepStr(/LOG/, file, "v");
        assert.equal(res, "WARN 2");
    });

    it("count", () => {
        const res = grepStr(/LOG/, file, { count: true });
        assert.equal(res, "2");
    });

    it("-c", () => {
        const res = grepStr(/LOG/, file, "c");
        assert.equal(res, "2");
    });

    it("maxCount", () => {
        const res = grepStr(/LOG/, file, { maxCount: 1 });
        assert.equal(res, "LOG 1");
    });
});
