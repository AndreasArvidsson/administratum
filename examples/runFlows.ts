import { runFlows, Path } from "../src";

(async () => {
  const files = new Path(__dirname).glob("**/**.flow.ts").sort();

  await runFlows({ files });
})();
