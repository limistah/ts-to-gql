import { faker } from "@faker-js/faker";
import { Author, Book } from "types/book.interface";

const authors = Array.from<Author>({ length: 3 }).map((item, index) => {
  return {
    id: index,
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 65 }),
  };
});

export const books = Array.from<Book>({ length: 10 }).map((item, index) => {
  return {
    id: index,
    name: faker.person.fullName(),
    rating: faker.number.int({ min: 0, max: 10 }),
    authors,
  };
});
