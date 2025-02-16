import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("スキーマテスト", () => {
	it("正しいデータをパースする", () => {
		const schema = z.object({
			name: z.string(),
			age: z.number(),
		});

		const data = { name: "Alice", age: 25 };
		const result = schema.parse(data);

		expect(result).toEqual(data);
	});

	it("不正なデータをパースしない", () => {
		const schema = z.object({
			name: z.string(),
			age: z.number(),
		});

		const invalidData = { name: "Alice", age: "twenty-five" };

		expect(() => schema.parse(invalidData)).toThrow();
	});
});
