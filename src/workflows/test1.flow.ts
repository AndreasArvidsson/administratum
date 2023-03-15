import { task, workflow } from "../Administratum";
import { sleep } from "../utils/cron";

workflow("tests1", () => {
  task("task1", async () => {
    await sleep("2s");
  });

  task("task2", async () => {
    await sleep("5s");
  });
});
