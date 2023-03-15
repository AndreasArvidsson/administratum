import { mv } from "../mv";
import { extract } from "../extract";
import { fetch } from "../fetch";
import { mkdir, mkdirs } from "../mkdir";
import { $ } from "../shell";
import { pwd } from "../pwd";
import { rm } from "../rm";
import { tempFile } from "../tempFile";
import { touch } from "../touch";
import { promptContinue } from "../prompt";
import { countdown, sleep } from "../cron";
import { grep } from "../grep";
import { ls } from "../ls";
import { find, findStr } from "../find";
import { cp } from "../cp";
import { progressPromises } from "../progress";

async function run() {
  // const res = await $("ls -la");
  // console.log(res.stdout);
  // console.log(
  //   await fetch(
  //     "https://zagerguitar.com/wp-content/uploads/2015/09/20160322_152654.jpg"
  //   )
  // );
  // console.log(await extract("DeDRM_tools_7.2.1.zip", "hello"));
  // console.log(await mkdirs("a/b/c"));
  // console.log(await mv("DeDRM_tools_7.2.1.zip", "a/b.b"));
  // console.log(pwd());
  // console.log(await rm("b", { recursive: true }));
  // console.log(await tempFile("stuff"));
  // console.log(await touch("LICENSE"));
  // console.log(await promptContinue());
  // await sleep(2.5)
  // after(2.5, () => console.log("after"));
  // countdown(6, (left) => console.log(left));
  // console.log(
  //   await grep(/@types/, "package.json", {
  //     lineNumber: true,
  //   })
  // );
  // console.log(await ls(".", { all: true, long: true }));
  // console.log(await findStr("src", { name: /t/ }));
  // console.log(await cp("src", "b", { recursive: true, force: true }));

  const promises = [sleep(2.5), sleep(1.5), sleep(0.5), sleep(5.5)];
  await progressPromises(
    "My progress promises",
    promises,
    (i, resolved, response) => {
      return resolved ? " :) " : " :( " + i;
    }
  );
  console.log("done with progress promises");
}

run();

// const files = await fs.promises.readdir(dirPath);
// const stat = await fs.promises.stat(filePath);
