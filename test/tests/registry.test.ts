import assert from "node:assert";
import {
    regAddKey,
    regAddValue,
    regDelKey,
    regDelValue,
    regHasKey,
    regHasValue,
    regQueryKey,
    regQueryValue
} from "../../src";

const keyName =
    "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\AdministratumTest";
const valueName = "value name";
const dataType = "REG_SZ";
const data = "some data";
const expected = "The operation completed successfully.";

describe("registry", () => {
    it("regQueryKey() ", () => {
        const res = regQueryKey(
            "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer"
        );
        assert.ok(res != null);
        assert.ok(res.values.length > 10);
        assert.ok(res.children.length > 10);
    });

    it("regQueryKey() no children", () => {
        const res = regQueryKey(
            "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Feeds"
        );
        assert.ok(res != null);
        assert.ok(res.values.length > 0);
        assert.equal(res.children.length, 0);
    });

    it("regQueryKey() empty", () => {
        const res = regQueryKey(
            "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Ext"
        );
        assert.ok(res != null);
        assert.equal(res.values.length, 0);
        assert.equal(res.children.length, 0);
    });

    it("regAddKey()", () => {
        const res = regAddKey(keyName);
        assert.equal(res, expected);
    });

    it("regAddValue()", () => {
        const res = regAddValue(keyName, valueName, dataType, data);
        assert.equal(res, expected);
    });

    it("regHasKey()", () => {
        const res = regHasKey(keyName);
        assert.ok(res);
    });

    it("regHasValue()", () => {
        const res = regHasValue(keyName, valueName);
        assert.ok(res);
    });

    it("regQueryValue()", () => {
        const res = regQueryValue(keyName, valueName);
        assert.ok(res != null);
        assert.equal(res.name, valueName);
        assert.equal(res.type, dataType);
        assert.equal(res.data, data);
    });

    it("regQueryKey() missing", () => {
        const res = regQueryKey(keyName + "_missing");
        assert.ok(res == null);
    });

    it("regQueryValue() missing", () => {
        const res = regQueryValue(keyName, valueName + "_missing");
        assert.ok(res == null);
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
