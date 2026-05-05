import fs from "node:fs";
import { Path } from "./Path.js";

export function appendFile(file: Path | string, data: string): Path {
    file = new Path(file);

    fs.appendFileSync(file.path, data, { encoding: "utf8" });

    return file;
}
