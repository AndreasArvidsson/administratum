import { mv } from "../src/mv";
import { extract } from "../src/extract";
import { fetch } from "../src/fetch";
import { mkdir, mkdirs } from "../src/mkdir";
import { $ } from "../src/shell";
import { pwd } from "../src/pwd";
import { rm } from "../src/rm";
import { tempFile } from "../src/tempFile";
import { touch } from "../src/touch";

async function run() {
  //   const res = await $("ls -la");
  //   console.log(res.stdout);
  //   const r = await fetch(
  //     "https://zagerguitar.com/wp-content/uploads/2015/09/20160322_152654.jpg"
  //   );
  //   console.log(r);
  //   console.log(await extract("DeDRM_tools_7.2.1.zip", "hello"));
  //   console.log(await mkdirs("a/b/c"));
  //   console.log(await mv("DeDRM_tools_7.2.1.zip", "a/b.b"));
  //   console.log(pwd());
  //   console.log(await rm("b", { recursive: true }));
  // console.log(tempFile("stuff"));
  // console.log(await touch("LICENSE"));
}

run();

// const files = await fs.promises.readdir(dirPath);
// const stat = await fs.promises.stat(filePath);
