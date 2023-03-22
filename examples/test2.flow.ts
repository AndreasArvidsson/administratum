import { flow } from "../src";

flow("Flow 2", (task) => {
  task("Task 2:1", () => {
    console.log("Task 2:1 start");
    console.log("Task 2:1 done");
  });

  task.skip("Task 2:2", () => {
    console.log("Task 2:2 start");
    console.log("Task 2:2 done");
  });
});
