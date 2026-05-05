import { $, fetch, mkdirs, mv } from "../src/index.js";

const url =
    "https://cdn.shopify.com/s/files/1/0255/8659/7968/products/JH-137.jpg";

await fetch(url);
mkdirs("misc");
mv("JH-137.jpg", "misc");
console.log($("ls -l"));
