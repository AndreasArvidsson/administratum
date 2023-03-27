import fs from "node:fs";
import { Path } from ".";

export const writeFile = (file: Path | string, data: unknown): Path => {
    file = new Path(file);

    const content =
        typeof data === "string" ? data : JSON.stringify(data, null, 4);

    fs.writeFileSync(file.path, content, {
        encoding: "utf8",
    });

    return file;
};
