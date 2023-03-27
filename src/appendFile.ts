import fs from "node:fs";
import { Path } from ".";

export const appendFile = (file: Path | string, data: string): Path => {
    file = new Path(file);

    fs.appendFileSync(file.path, data, { encoding: "utf8" });

    return file;
};
