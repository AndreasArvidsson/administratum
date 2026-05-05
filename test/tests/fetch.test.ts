import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { fetch } from "../../src/fetch.js";

const url =
    "https://raw.githubusercontent.com/AndreasArvidsson/administratum/main/images/Imperio_adeptus_administratum_adepto.webp";

const urlRedirect =
    "https://httpbin.dev/redirect-to?url=https://httpbin.dev/bytes/16";

describe("fetch()", () => {
    const destination = path.join(os.tmpdir(), uuidv4());

    it("fetch", async () => {
        const res = await fetch(url, destination);
        assert.equal(destination, res.file.path);
        assert.ok(fs.existsSync(res.file.path));
        assert.ok(res.message.includes("Downloaded"));
    });

    it("fetch existing", async () => {
        const res = await fetch(url, destination);
        assert.equal(destination, res.file.path);
        assert.ok(fs.existsSync(res.file.path));
        assert.ok(res.message.includes("existed"));
    });

    it("fetch redirect", async () => {
        const destination = path.join(os.tmpdir(), uuidv4());
        const res = await fetch(urlRedirect, destination);
        assert.equal(destination, res.file.path);
        assert.ok(fs.existsSync(res.file.path));
    });
});
