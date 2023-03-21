import assert from "node:assert";
import { after, countdown, sleep } from "../../src";

const t = 25;
const ts = `${t}ms`;

describe("cron", () => {
  it("sleep()", async () => {
    const t1 = Date.now();
    await sleep(ts);
    const t2 = Date.now();
    assert.ok(t2 >= t1 + t);
  });

  it("after()", async () => {
    const t1 = Date.now();
    await new Promise<void>((resolve) => {
      after(ts, () => resolve());
    });
    const t2 = Date.now();
    assert.ok(t2 >= t1 + t);
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
    assert.ok(t2 >= t1 + 1000);
    assert.deepEqual(res, [1, 0]);
  });
});
