import { GqlDefinitionTypes } from "../lib/toGql/types";

export interface Book {
  __kind: GqlDefinitionTypes.TYPE; // this can just be an internal enum
  id: string;
  name: string;
  rating: number;
  authors: Author[];
}

export interface Author {
  __kind: GqlDefinitionTypes.TYPE;
  id: string;
  name: string;
  age?: number;
}

export interface Filter {
  __kind: GqlDefinitionTypes.INPUT;
  rating?: number;
}

export interface Response {
  __kind: GqlDefinitionTypes.TYPE;
  books: Book[];
}
