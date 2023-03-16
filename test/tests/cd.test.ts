import assert from "assert";
import os from "os";
import path from "path";
import { cd } from "../..";

describe("cd", () => {
  it("cd()", () => {
    const res = cd();
    assert.equal(res, os.homedir());
    assert.equal(process.cwd(), os.homedir());
  });

  it("cd(-)", () => {
    const oldpwd = process.env.OLDPWD;
    const res = cd("-");
    assert.equal(res, oldpwd);
    assert.equal(process.cwd(), oldpwd);
  });

  it("cd(..)", () => {
    const pwd1 = process.cwd();
    const res = cd("..");
    const pwd2 = process.cwd();
    assert.equal(res, path.dirname(pwd1));
    assert.equal(pwd2, path.dirname(pwd1));
  });
});
