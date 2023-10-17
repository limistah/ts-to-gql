import fse from "fs-extra";
import { globSync } from "glob";
import { toGql } from "./lib";

export const genrateTypeDefinitions = async (
  dir: string,
  exclude?: string[],
  outfile = "typeDefs.graphql"
) => {
  if (!fse.existsSync(dir)) {
    throw "Base directory does not exists";
  }

  const tsFiles = globSync(`${dir}/**/*.ts`, { ignore: exclude });
  const defs = [];
  for (const filePath of tsFiles) {
    const def = toGql(filePath);
    defs.push(def);
  }

  fse.writeFileSync(`${dir}/${outfile}`, defs.join("\n").trim());
};
