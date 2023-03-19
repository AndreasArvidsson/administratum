import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  outdir: "dist",
  platform: "node",
  packages: "external",
  bundle: true,
  minify: true,
  sourcemap: true,
});
