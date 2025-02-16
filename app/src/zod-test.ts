import { z } from "zod";

// zodParse();
// zodSafeParse();
// zodRefine();
// zodTransform();
// zodOptional();
// zodNullable();
// zodDefault();
// zodCatch();
// zodArray();
// zodUnion();
// zodEnum();
// zodLazy();
zodPickOmit();

// スキーマの型に基づいて、データを検証し、必要な場合は変換を行うメソッド
export function zodParse() {
  const schema = z.object({
    name: z.string(),
    age: z.number(),
  });

  const data = { name: "Alice", age: 25 };
  const result = schema.parse(data);

  console.log(`parse: ${result}`);
}

// parseと似ているが、エラーをスローせず、成否結果をオブジェクトで返すメソッド
export function zodSafeParse() {
  const schema = z.object({
    name: z.string(),
    age: z.number(),
  });
  const data1 = { name: "Alice", age: 25 };
  const result1 = schema.safeParse(data1);

  if (result1.success) {
    console.log("safeParse: 成功", result1.data);
  } else {
    console.error("safeParse: 失敗", result1.error);
  }

  const data2 = { name: "Alice", age: "25" };
  const result2 = schema.safeParse(data2);

  if (result2.success) {
    console.log("safeParse: 成功", result2.data);
  } else {
    console.error("safeParse: 失敗", result2.error);
  }
}

// カスタムバリデーションルールを追加するメソッド
export function zodRefine() {
  const schema = z.string().refine((val) => val.startsWith("A"), {
    message: "値は'A'で始まる必要があります",
  });
  schema.parse("Apple"); // 成功
  schema.parse("Banana"); // エラー
}

// データを特定の形式に変換するメソッド
export function zodTransform() {
  const schema = z.string().transform((val) => val.toUpperCase());
  console.log(schema.parse("hello")); // 出力: "HELLO"
}

// 値を省略可能にするメソッド
export function zodOptional() {
  const schema = z.object({
    name: z.string(),
    age: z.number().optional(),
  });

  console.log(schema.parse({ name: "Alice" })); // 出力: { name: "Alice" }
}

// null値を許可するメソッド
export function zodNullable() {
  const schema = z.string().nullable();
  console.log(schema.parse(null)); // 出力: null
}

// 値が指定されない場合に、デフォルト値を設定するメソッド
export function zodDefault() {
  const schema = z.string().default("デフォルト値");
  console.log(schema.parse(undefined)); // 出力: "デフォルト値"
}

// スキーマに合致しない場合でも、デフォルト値を返すメソッド
export function zodCatch() {
  const schema = z.string().catch("デフォルト値");

  console.log(schema.safeParse(undefined)); // 出力: "デフォルト値"
}

// 配列を定義するメソッド
export function zodArray() {
  const schema = z.array(z.string());
  console.log(schema.parse(["Alice", "Bob"])); // 出力: ["Alice", "Bob"]
}

// 複数の型のいずれかを許可するメソッド
export function zodUnion() {
  const schema = z.union([z.string(), z.number()]);

  console.log(schema.parse("Alice")); // 出力: "Alice"
  console.log(schema.parse(123)); // 出力: 123
}

// 限定された値の集合を許可するメソッド
export function zodEnum() {
  const schema = z.enum(["Red", "Green", "Blue"]);

  console.log(schema.parse("Red")); // 出力: "Red"
  schema.parse("Yellow"); // エラー
}

// 再帰的なスキーマを作成する際に使用
export function zodLazy() {
  // const node = z.object({
  // 	value: z.string(),
  // 	children: z.array(z.lazy(() => node)).optional(),
  // });
  // const data = {
  // 	value: "祖母",
  // 	children: [
  // 		{ value: "長男" },
  // 		{ value: "次男", children: [{ value: "孫" }] },
  // 	],
  // };
  // console.log(node.parse(data));
}

// 既存のスキーマから一部のフィールドを選択または除外する
export function zodPickOmit() {
  const schema = z.object({
    name: z.string(),
    age: z.number(),
    email: z.string(),
  });

  const picked = schema.pick({ name: true });
  const omitted = schema.omit({ age: true });

  console.log(picked.parse({ name: "Alice" })); // 出力: { name: "Alice" }
  console.log(omitted.parse({ name: "Alice", email: "test@example.com" })); // 出力: { name: "Alice", email: "test@example.com" }
}
