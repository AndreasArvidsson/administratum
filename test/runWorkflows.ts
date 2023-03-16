import { globSync } from "glob";
import path from "path";
import { Administratum } from "..";

(async () => {
  const cwd = path.join(__dirname, "workflows");

  const files = globSync("**/**.flow.ts", { cwd })
    .map((f) => path.resolve(cwd, f))
    .sort();

  const administratum = new Administratum({ files });

  await administratum.run();
})();