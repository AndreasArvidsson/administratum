import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  outfile: "lib/index.js",
  platform: "node",
  packages: "external",
  bundle: true,
  minify: true,
});
