// Walk through the project folder
// Would all the types be in a single file or spread across, this would affect the implementation inturn the runtime.
// for a situation where the interfaces are spread across all the codebase find files that have at least an interface and have __kind field
// for a situation where the interfaces are exported in a single file, read the single file and parse the content.

// First implementation for a single file

import fs from "node:fs";

const jsTypeToGqlType = (jsType: string) => {
  return (
    {
      string: "String",
      number: "Int",
      String: "String",
      Number: "Int",
    }[jsType] || ""
  );
};

const customTypeToGqlType = (customType: string) => {
  const matches = customType.match(/(.*)[\[\]]*/);

  const fieldType = matches?.[1];
  if (fieldType?.includes("[]")) {
    const modField = fieldType.replace("[]", "");
    return `[${modField}]`;
  }
  return fieldType || "";
};

const getBlockName = (block: string) => {
  const name = block.match(/interface([a-zA-Z_]+)[{]/);
  return name?.[1];
};

const getBlockType = (block: string) => {
  const kind = block.match(/__kind:(.*?);/);

  if (!kind) return "";

  const kindNames = kind?.[1]?.split(".");

  if (kindNames.length < 2) return "";

  const val = kindNames[1];
  return val.toLowerCase();
};

const getFields = (block: string) => {
  const fields: { [k: string]: string } = {};
  const blMatches = block.match(/{(.*?)}/);
  const groupMatch = blMatches?.[1];
  const groupMatches = groupMatch?.match(/(.*?);/gm);
  groupMatches?.forEach((grpMatch) => {
    const info = grpMatch.split(":");
    const [fieldName, fieldType] = info;
    if (info[0] !== "__kind") {
      const field = fieldName.replace("?", "");
      const type = fieldType.replace(";", "");

      let gqlType = jsTypeToGqlType(type);

      if (!gqlType) {
        gqlType = customTypeToGqlType(type);
      }
      const isOptional = fieldName[fieldName.length - 1] === "?";
      if (!isOptional) {
        gqlType = `${gqlType}!`;
      }
      fields[field] = gqlType;
    }
  });
  return fields;
};

const generateDefs = (intBlock: string) => {
  const defName = getBlockName(intBlock);
  const defType = getBlockType(intBlock);
  const defFields = getFields(intBlock);

  let def = `\n  ${defType} ${defName} {`;

  for (const fieldName of Object.keys(defFields)) {
    const fieldType = defFields[fieldName];
    def = `${def}\n    ${fieldName}: ${fieldType}`;
  }

  def = `${def}\n  }\n`;
  return def;
};
export const toGql = (filePath: string) => {
  let defs = ``;

  const content = fs.readFileSync(filePath);

  const interfaceBlocks = content
    .toString()
    .replaceAll(" ", "")
    .replaceAll(/(\/\/|#)(.*?)\n/gm, "")
    .replaceAll("\n", "")
    .match(/interface([a-zA-Z_]+)[{](.|\n)*?[}]/gm);

  interfaceBlocks?.forEach((block) => {
    if (block.includes("__kind")) {
      const def = generateDefs(block);
      defs = `${defs}${def}`;
    }
  });
  return defs;
};

// import { performance } from "perf_hooks";
// const start = performance.now();
// const defs = toGql(path.resolve(__dirname, "book.graphql.ts"));
// console.log("performance ends", performance.now() - start);
// console.log(defs);
