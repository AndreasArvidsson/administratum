import fs from "node:fs";
import { Path } from ".";

export const appendFile = (file: Path | string, data: string): void => {
    file = new Path(file);

    fs.appendFileSync(file.path, data, { encoding: "utf8" });
};
