import { flow, sleep } from "../src";

flow("Flow 1", async (task) => {
  await sleep("500ms");

  task("task 1:1", async () => {
    console.log("1:1 start");
    await sleep("500ms");
    console.log("1:1 done");
  });

  task("task 1:2", async () => {
    console.log("1:2 start");
    await sleep("500ms");
    console.log("1:2 done");
  });

  task.skip("task 1:3", async () => {
    console.log("skipped");
  });
});

flow.skip("Flow 2", (task) => {
  task("Task 2:1", () => {
    console.log("skipped");
  });
});

flow("Flow 3", (task) => {
  task.skip("Task 3:1", () => {
    console.log("skipped");
  });
});

flow("Flow 4", (task) => {
  task.skip("Task 4:1", () => {
    console.log("skipped");
  });

  task.skip("Task 4:2", () => {
    console.log("skipped");
  });

  task("Task 4:3", async () => {
    console.log("4:3 start");
    await sleep("10ms");
    console.log("4:3 done");
  });

  task("Task 4:4", () => {
    console.log("4:4 start");
    console.log("4:4 done");
  });
});
