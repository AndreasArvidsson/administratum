import { v4 as uuidv4 } from "uuid";
import os from "os";
import _path from "path";
import fs from "fs";

export const tempFile = async (content: string) => {
  const path = _path.join(os.tmpdir(), uuidv4());
  fs.writeFileSync(path, content);
  return path;
};
