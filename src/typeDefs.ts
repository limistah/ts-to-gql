import fse from "fs-extra";
import path from "node:path";

const defsStr = fse.readFileSync(path.resolve(__dirname, "typeDefs.graphql"));

const resolverStr = fse.readFileSync(
  path.resolve(__dirname, "resolver.graphql")
);

export const typeDefs = `${defsStr} \n ${resolverStr}`;
