import { flow, sleep } from "../src";

flow("Flow 1", async (task) => {
  task("task 1:1", async () => {
    console.log("Task 1:1 start");
    await sleep("500ms");
    console.log("Task 1:1 done");
  });

  task("task 1:2", async () => {
    console.log("Task 1:2 start");
    await sleep("500ms");
    console.log("Task 1:2 done");
  });
});
