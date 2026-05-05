import assert from "node:assert/strict";
import { sleep } from "../../src/cron.js";
import { tempFile } from "../../src/tempFile.js";
import { touch } from "../../src/touch.js";

describe("touch", () => {
    it("touch()", async () => {
        const res = tempFile("");
        const t1 = res.stats().mtime;
        await sleep("10ms");
        touch(res);
        const t2 = res.stats().mtime;
        assert.notEqual(t1.getTime(), t2.getTime());
    });
});
