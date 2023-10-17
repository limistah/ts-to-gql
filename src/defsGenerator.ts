import path from "node:path";
import { genrateTypeDefinitions } from "./lib/toGql";

// Generate type definitions
const baseDir = path.resolve(__dirname);
genrateTypeDefinitions(baseDir, [
  // Don't walk through the library itself
  `${baseDir}/lib/toGql/**/*.ts`,
]);
