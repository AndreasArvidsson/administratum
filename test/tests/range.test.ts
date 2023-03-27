import assert from "node:assert";
import { range } from "../../src";

describe("range", () => {
    it("range(5)", () => {
        assert.deepEqual([...range(5)], [0, 1, 2, 3, 4]);
    });

    it("range(2, 5)", () => {
        assert.deepEqual([...range(2, 5)], [2, 3, 4]);
    });

    it("range(2, 8, 2)", () => {
        assert.deepEqual([...range(2, 8, 2)], [2, 4, 6]);
    });

    it("range.map", () => {
        assert.deepEqual(
            range(5).map((i) => i),
            [0, 1, 2, 3, 4]
        );
    });
});
