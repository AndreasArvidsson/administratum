import assert from "node:assert";
import { Stats } from "node:fs";
import os from "node:os";
import pathlib from "node:path";
import { getCtime, Path } from "../../src";
import { fixturesDir } from "../testUtil";

const dir = new Path(fixturesDir).join("list");
const file = dir.join("a");

describe("Path", () => {
  it("home()", () => {
    assert.equal(Path.home().path, os.homedir());
  });

  it("temp()", () => {
    assert.equal(Path.temp().path, os.tmpdir());
  });

  it("cwd()", () => {
    assert.equal(Path.cwd().path, process.cwd());
  });

  it("sep()", () => {
    assert.equal(Path.sep(), pathlib.sep);
  });

  it("oldPWD()", () => {
    assert.equal(Path.oldPWD()?.path, process.env.OLDPWD);
  });

  it("new Path(string)", () => {
    assert.equal(new Path("dir").path, pathlib.resolve("dir"));
  });

  it("new Path(Path)", () => {
    assert.equal(new Path(new Path("dir")).path, pathlib.resolve("dir"));
  });

  it("name", () => {
    assert.equal(new Path("file.txt").name, "file.txt");
  });

  it("name short", () => {
    assert.equal(new Path("file").name, "file");
  });

  it("ext", () => {
    assert.equal(new Path("file.txt").ext, ".txt");
  });

  it("ext missing", () => {
    assert.equal(new Path("file").ext, "");
  });

  it("exists()", () => {
    assert.ok(file.exists());
  });

  it("!exists()", () => {
    assert.ok(!new Path(fixturesDir).join("fail").exists());
  });

  it("isFile()", () => {
    assert.ok(file.isFile());
  });

  it("isDir()", () => {
    assert.ok(dir.isDir());
  });

  it("size()", () => {
    assert.ok(file.size() > 0);
  });

  it("stats()", () => {
    assert.ok(file.stats() instanceof Stats);
  });

  it("toString()", () => {
    assert.equal(file.toString(), file.path);
  });

  it("join()", () => {
    assert.equal(dir.join("a").path, file.path);
  });

  it("dir()", () => {
    assert.equal(file.dir().path, dir.path);
  });

  it("relative()", () => {
    assert.equal(dir.relative(file), file.name);
  });

  it("files()", () => {
    assert.equal(dir.files().length, 4);
  });

  it("glob()", () => {
    assert.equal(dir.glob("b").length, 1);
  });

  it("sort()", () => {
    const actual = [new Path("b"), new Path("a")].sort().map((p) => p.name);
    assert.deepEqual(actual, ["a", "b"]);
  });

  it("getCtime()", () => {
    assert.ok(getCtime(file) instanceof Date);
  });
});
