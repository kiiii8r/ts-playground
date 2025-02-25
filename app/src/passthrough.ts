/* 
【passthroughメソッドとは？】
- スキーマに定義されていないプロパティを許可するメソッド

【ユースケース】
- 外部のシステムのAPIなど、変更をコントロールしづらく、情報としても削り落としたくない場合
- 未定義分もログとしては残したい場合

【要点】
- ZodObjectで使用
- ネストしたZodObjectにも適用される
- 一部のプロパティに適用させたくない場合はstrictメソッドを使用
*/


import { z } from "zod";


// テストデータの検証
function validateTestData(testDataList: { data: any; titleLabel: string }[]) {
    console.log('【Zodスキーマの型】');
    console.log(schema.shape);
    console.log('');
    console.log('【実行結果】');
    for (const { data, titleLabel} of testDataList) {
        try {
            const parseSchema = schema.parse(data);
            console.log(`○成功: ${titleLabel} -> ${JSON.stringify(data)} `);
        } catch (e: unknown) {
            if (e instanceof z.ZodError) {
                console.error(`×失敗: ${titleLabel} -> ${JSON.stringify(data)} `);
            } else {
                console.error(`×失敗: ${titleLabel} -> ${JSON.stringify(data)} `);
            }
        }
    }
}


// ネストなし
const testDataList = [
    { titleLabel: "全て", data: { id: 1, name: "taro" } },
    { titleLabel: "nameがない", data: { id: 1 } },
    { titleLabel: "未定義のlogを含む", data: { id: 1, name: "taro", newPropaty: "新規プロパティ", warn: "警告メッセージ" } },
];

// ZodObjectにのみ使用可能
// const scheme = z.object({
//     id: z.number(),
//     name: z.string().passthrough(),
//   }).passthrough();

/*
    未定義のプロパティを許可する
    追加されたプロパティやログとして残したい情報を抽出
*/
const schema = z.object({
    id: z.number(),
    name: z.string(),
  }).passthrough();

const parseSchema = schema.parse(testDataList[2].data);
const { id, name, ...otherPropaty } = parseSchema;
console.log('【未定義のプロパティ抽出】');
console.log(otherPropaty);
console.log('');

validateTestData(testDataList);

// ネストあり
const testNestDataList = [
    { titleLabel: "全て", data: { user: { id: 1, name: "taro" } } },
    { titleLabel: "nameがない", data: { user: { id: 1 } } },
    { titleLabel: "未定義のageを親スキーマの要素に含む", data: { user: { id: 1, name: "taro" } }, age: 10 },
    { titleLabel: "未定義のageをネストしたスキーマの要素に含む", data: { user: { id: 1, name: "taro", age: 10 } } },
];

const nestSchema = z.object({
    id: z.number(),   // id: string;
    name: z.string(), // name: string;
});

// ネストの中にも適用される
// const schema = z.object({
//     user: nestSchema // user: { id: string; name: string; }
// }).passthrough();

// ネストの中には適用させたくない
// const schema = z.object({
//     user: nestSchema.strict() // user: { id: string; name: string; }
// }).passthrough();

// validateTestData(testNestDataList);
