import assert from "assert";
import {
  regAddKey,
  regAddValue,
  regDelKey,
  regDelValue,
  regHasValue,
  regQueryKey,
  regQueryValue,
} from "../../src/registry";

const keyName =
  "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\AdministratumTest";
const valueName = "value name";
const dataType = "REG_SZ";
const data = "some data";
const expected = "The operation completed successfully.";

describe("registry", () => {
  it("regQueryKey()", () => {
    const res = regQueryKey(
      "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer"
    );
    assert.ok(res.values.length > 10);
    assert.ok(res.children.length > 10);
  });

  it("regAddKey()", () => {
    const res = regAddKey(keyName);
    assert.equal(res, expected);
  });

  it("regAddValue()", () => {
    const res = regAddValue(keyName, valueName, dataType, data);
    assert.equal(res, expected);
  });

  it("regHasValue()", () => {
    const res = regHasValue(keyName, valueName);
    assert.ok(res);
  });

  it("regQueryValue()", () => {
    const res = regQueryValue(keyName, valueName);
    assert.equal(res.name, valueName);
    assert.equal(res.type, dataType);
    assert.equal(res.data, data);
  });

  it("regDelValue()", () => {
    const res = regDelValue(keyName, valueName);
    assert.equal(res, expected);
  });

  it("regDelKey()", () => {
    const res = regDelKey(keyName);
    assert.equal(res, expected);
  });
});
