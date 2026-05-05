import type { Flow } from "../src/index.js";
import { sleep } from "../src/index.js";

export const flow1: Flow = {
    name: "Flow 1",

    run: async ({ task, properties }) => {
        await sleep("500ms");

        console.log(`property: '${properties.get("flow1.value")}'\n`);

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
    },
};

export const flow2: Flow = {
    name: "Flow 2",

    run: async ({ task, properties }) => {
        await sleep("500ms");

        console.log(`property: '${properties.get("flow2.value")}'\n`);

        task("task 2:1", async () => {
            console.log("2:1 start");
            await sleep("500ms");
            console.log("2:1 done");
        });

        task("task 2:2", async () => {
            console.log("2:2 start");
            await sleep("500ms");
            console.log("2:2 done");
        });
    },
};
