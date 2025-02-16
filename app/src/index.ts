import { z } from "zod";

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

const data = { name: "Alice", age: 25 };
const result = schema.parse(data);

console.log(result);