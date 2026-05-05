import { exit } from "node:process";

export async function promptContinue(): Promise<void> {
    const doContinue = await promptYesNo("Do you wish to continue?");
    if (doContinue) {
        console.log("");
    } else {
        exit(0);
    }
}

export async function promptYesNo(question: string): Promise<boolean> {
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
}

function readLine(): Promise<string> {
    return new Promise<string>((resolve) => {
        process.stdin.setEncoding("utf8");
        process.stdin.once("data", (data) => {
            resolve(data.toString().trim());
        });
    });
}
