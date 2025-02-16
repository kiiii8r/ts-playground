"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const schema = zod_1.z.object({
    name: zod_1.z.string(),
    age: zod_1.z.number(),
});
const data = { name: "Alice", age: 25 };
const result = schema.parse(data);
console.log(result);
