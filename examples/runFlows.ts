import { runFlows, Path } from "../src";

(async () => {
    const files = new Path(__dirname).glob("**/**.flow.ts").sort();
    const propertiesFile = process.argv[2];

    await runFlows({ files, propertiesFile, skipPrompt: false });
})();
