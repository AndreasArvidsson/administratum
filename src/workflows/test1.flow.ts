import { task, workflow } from "../Administratum";
import { fetch } from "../utils/fetch";
import { mkdirs } from "../utils/mkdir";
import { mv } from "../utils/mv";

const url =
  "https://cdn.shopify.com/s/files/1/0255/8659/7968/products/JH-137.jpg";

workflow("Example", () => {
  task("Download", () => fetch(url));
  task("mkdir", () => mkdirs("stuff"));
  task("Move", () => mv("JH-137.jpg", "stuff/"));
});
