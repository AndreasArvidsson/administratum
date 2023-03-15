export const promptContinue = async () => {
  const doContinue = await promptYesNo("Do you wish to continue?");
  if (doContinue) {
    console.log("");
  } else {
    process.exit(0);
  }
};

export const promptYesNo = async (question: string) => {
  for (;;) {
    console.log(`- ${question} [Y/n]`);
    const line = await readLine();

    switch (line.toLowerCase()) {
      case "yes":
      case "y":
      case "":
        return true;
      case "no":
      case "n":
        return false;
      default:
        console.log("Please answer yes or no");
    }
  }
};

const readLine = () => {
  return new Promise<string>((resolve) => {
    process.stdin.setEncoding("utf-8");
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
};
