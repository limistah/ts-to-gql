import { Filter } from "./types/book.interface";
import { books } from "./dataGenerator";

export const resolvers = {
  Query: {
    book(_, args: { input: Filter }) {
      const ind = books.findIndex((book) => book.rating === args.input.rating);
      return books[ind];
    },
    books: (_, args: { input: Filter }) => {
      return args.input.rating != undefined
        ? books.filter((book) => book.rating === args.input.rating)
        : books;
    },
  },
};
