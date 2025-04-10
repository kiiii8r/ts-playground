/*
【JSON typeとは？】
- 任意の型を検証する場合に、「JSONとして有効か」のチェックをする、有志の汎用スキーマの例。

【ユースケース】
- API経由で自由なJSONが飛んでくる場合
- スキーマレスDBで「そもそもJSONとして変な構造じゃないか」のみをチェックしたい場合
- Formなどのユーザーの自由入力で、JSONとして有効かのチェックをしたい場合
*/

import { z } from 'zod';

// テストデータの検証
function validateTestData(testDataList: { data: unknown; titleLabel: string }[], schema: z.ZodType<unknown>) {
    console.log('【実行結果】');
    for (const { data, titleLabel } of testDataList) {
        try {
            const parseSchema = schema.parse(data);
            console.log(`○成功: ${titleLabel} IN: ${JSON.stringify(data)} -> OUT: ${JSON.stringify(parseSchema)} `);
        } catch (e: unknown) {
            if (e instanceof z.ZodError) {
                console.error(`×失敗: ${titleLabel} IN: ${JSON.stringify(data)} -> OUT: ${JSON.stringify(e.errors)} `);
            } else {
                console.error(`×失敗: ${titleLabel} IN: ${JSON.stringify(data)} -> OUT: ${JSON.stringify(e)} `);
            }
        }
    }
}

// JSON type（ Suggested by ggoodman. ）
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]); // プリミティブ型（基本の型）をまとめる
type Literal = z.infer<typeof literalSchema>;                                   // リテラル値の型を推論
type Json = Literal | { [key: string]: Json } | Json[];                         // JSONの型を定義（入れ子構造を含めるため再起的に）
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])           // 値、配列、オブジェクトのいずれかであることを表し、再帰的に定義
);

const validTestDataList = [
  { titleLabel: "プリミティブ型（文字列）", data: "文字列" },
  { titleLabel: "プリミティブ型（数値）", data: 123 },
  { titleLabel: "プリミティブ型（真偽値）", data: true },
  { titleLabel: "プリミティブ型（null）", data: null },
  { titleLabel: "配列（混合型）", data: [1, "二", true, null] },
  { titleLabel: "オブジェクト", data: { key1: "value1", key2: 2, key3: false } },
  { titleLabel: "複雑な構造", data: { array: [1, { nestedKey: "nestedValue" }, [true, false]], key: "value" } },
  { titleLabel: "空のオブジェクト", data: {} },
  { titleLabel: "空の配列", data: [] },
  { titleLabel: "深いネストのオブジェクト", data: { a: { b: { c: { d: { e: "深い" } } } } } },
  { titleLabel: "深いネストの配列", data: [[[[["深い"]]]]] },
  { titleLabel: "さらに複雑な構造", data: { level1: { level2: { level3: { key: "value", array: [1, { deepKey: "deepValue" }, [false, null]] } } } } },
];
const invalidTestDataList = [
  { titleLabel: "未定義のプロパティ", data: undefined },
  { titleLabel: "関数を含むオブジェクト", data: { key: () => "関数" } },
  { titleLabel: "循環参照を含むオブジェクト", data: (() => { const obj: any = { a: 1 }; obj.b = obj; return obj; })() },
];

console.log('--- 有効なテストデータの検証 ---');
validateTestData(validTestDataList, jsonSchema); // jsonSchemaを用いた有効なテストデータの検証

console.log('');

console.log('--- 無効なテストデータの検証 ---');
validateTestData(invalidTestDataList, jsonSchema); // jsonSchemaを用いた無効なテストデータの検証