import assert from "assert";
import { sleep, after, countdown } from "../..";

describe("cron", () => {
  it("sleep()", async () => {
    const t1 = Date.now();
    await sleep("100ms");
    const t2 = Date.now();
    assert.ok(t2 >= t1 + 100);
  });

  it("after()", async () => {
    const t1 = Date.now();
    await new Promise<void>((resolve) => {
      after("100ms", () => resolve());
    });
    const t2 = Date.now();
    assert.ok(t2 >= t1 + 100);
  });

  it("countdown()", async () => {
    const t1 = Date.now();
    const res: number[] = [];
    await new Promise<void>((resolve) => {
      countdown(1, (left) => {
        res.push(left);
        if (!left) {
          resolve();
        }
      });
    });
    const t2 = Date.now();
    assert.ok(t2 >= t1 + 100);
    assert.deepEqual(res, [1, 0]);
  });
});
