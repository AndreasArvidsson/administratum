import esbuild from "esbuild";

await esbuild.build({
    entryPoints: ["src/index.ts"],
    outfile: "lib/index.js",
    platform: "node",
    packages: "external",
    format: "esm",
    bundle: true,
    minify: true,
});
