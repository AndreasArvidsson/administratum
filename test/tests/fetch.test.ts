import assert from "assert";
import fs from "fs";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fetch } from "../../src";

const url =
  "https://raw.githubusercontent.com/AndreasArvidsson/administratum/main/images/Imperio_adeptus_administratum_adepto.webp";

describe("fetch", () => {
  it("fetch()", async () => {
    const destination = path.join(os.tmpdir(), uuidv4());
    const res = await fetch(url, destination);
    assert.equal(destination, res.file.path);
    assert.ok(fs.existsSync(res.file.path));
  });
});
