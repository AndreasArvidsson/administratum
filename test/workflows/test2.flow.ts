import { sleep, task, workflow } from "../..";

workflow("tests2", () => {
  task("task2", async () => {
    await sleep("2s");
  });

  task("task2-2", async () => {
    await sleep("3s");
  });
});
