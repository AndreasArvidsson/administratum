import { $, fetch, mkdirs, mv } from "..";

const url =
  "https://cdn.shopify.com/s/files/1/0255/8659/7968/products/JH-137.jpg";

(async () => {
  await fetch(url);
  mkdirs("stuff");
  mv("JH-137.jpg", "stuff");
  console.log($("ls -l"));
})();
