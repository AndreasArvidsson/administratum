import * as path from "node:path";
import { fileURLToPath } from "node:url";

// oxlint-disable-next-line unicorn/prefer-import-meta-properties
const dirname = path.dirname(fileURLToPath(import.meta.url));
export const testsDir = path.join(dirname, "tests");
export const fixturesDir = path.join(dirname, "fixtures");
