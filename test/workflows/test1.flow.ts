import { fetch, mkdirs, mv, task, workflow } from "../..";

const url =
  "https://cdn.shopify.com/s/files/1/0255/8659/7968/products/JH-137.jpg";

workflow("Example", () => {
  task("Download", () => fetch(url));
  task("mkdir", () => mkdirs("stuff"));
  task("Move", () => mv("JH-137.jpg", "stuff/"));
});
