import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import { Path } from "./Path.js";

export function tempFile(content: string): Path {
    const path = Path.temp().join(uuidv4());

    fs.writeFileSync(path.path, content);

    return path;
}
