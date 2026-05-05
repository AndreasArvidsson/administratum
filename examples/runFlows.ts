import type { Flow } from "../src/index.js";
import { runFlows } from "../src/index.js";
import { flow1, flow2 } from "./example.flow.js";

const propertiesFile = process.argv[2];

const flows: Flow[] = [flow1, flow2];

await runFlows({ flows, propertiesFile, skipPrompt: false });
