import assert from "node:assert";
import { max, min } from "../../src";

const numbers = [5, 1, 9, 2, 7];
const objects = [
  { value: 5 },
  { value: 1 },
  { value: 9 },
  { value: 2 },
  { value: 7 },
];

const key = (v: { value: number }) => v.value;

describe("min()", () => {
  it("number list", () => {
    assert.equal(min(numbers), 1);
  });

  it("object list", () => {
    assert.deepEqual(min(objects), { value: 5 });
  });

  it("object list key", () => {
    assert.deepEqual(min(objects, { key }), { value: 1 });
  });
});

describe("max()", () => {
  it("number list", () => {
    assert.equal(max(numbers), 9);
  });

  it("object list", () => {
    assert.deepEqual(max(objects), { value: 5 });
  });

  it("object list key", () => {
    assert.deepEqual(max(objects, { key }), { value: 9 });
  });
});
