/* 
【passthroughメソッドとは？】
- スキーマに定義されていないプロパティを許可するメソッド

【ユースケース】
- 外部のシステムのAPIなど、変更をコントロールしづらく、情報としても削り落としたくない場合
- 未定義分もログとしては残したい場合

【要点】
- ZodObjectで使用
- ネストしたZodObjectには適用されない
- 一部のプロパティに適用させたくない場合はstrictメソッドを使用

【スキーマに定義されてないプロパティの処理の違い】
- デフォルト
    - parse時は許可、出力時は削除
- strictメソッド
    - parse時はエラー、出力時は削除
- passthroughメソッド
    - parse時は許可、出力時は残す
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
            console.log(`○成功: ${titleLabel} IN: ${JSON.stringify(data)} -> OUT: ${JSON.stringify(parseSchema)} `);
        } catch (e: unknown) {
            if (e instanceof z.ZodError) {
                console.error(`×失敗: ${titleLabel} IN: ${JSON.stringify(data)} -> OUT: ${JSON.stringify(e.name)} `);
            } else {
                console.error(`×失敗: ${titleLabel} IN: ${JSON.stringify(data)} -> OUT: ${JSON.stringify(e)} `);
            }
        }
    }
}

// ネストなし
const testDataList = [
    { titleLabel: "全て", data: { id: 1, name: "taro" } },
    { titleLabel: "nameがない", data: { id: 1 } },
    { titleLabel: "未定義のlogを含む", data: { id: 1, name: "taro", undefinedProperty: "未定義プロパティ" } },
];

// ZodObjectにのみ使用可能
const scheme = z.object({
    id: z.number(),
    name: z.string().passthrough(),
  }).passthrough();

// 
// const schema = z.object({
//     id: z.number(),
//     name: z.string(),
//   }).passthrough();

// const parseSchema = schema.parse(testDataList[2].data);
// const { id, name, ...otherPropaty } = parseSchema;
// console.log('【未定義のプロパティ抽出】');
// console.log(otherPropaty);
// console.log('');

validateTestData(testDataList);

// ネストあり
const testNestDataList = [
    // { titleLabel: "全て", data: { user: { id: 1, name: "taro" } } },
    // { titleLabel: "nameがない", data: { user: { id: 1 } } },
    { titleLabel: "未定義のプロパティを親スキーマの要素に含む", data: { user: { id: 1, name: "taro" }, undefinedProperty: "未定義プロパティ" } },
    { titleLabel: "未定義のプロパティをスキーマの要素に含む", data: { user: { id: 1, name: "taro", undefinedProperty: "未定義プロパティ" } } },
];

const nestSchema = z.object({
    id: z.number(),   // id: string;
    name: z.string(), // name: string;
});

// ネストの中には適用されない
// const schema = z.object({
//     user: nestSchema // user: { id: string; name: string; }
// }).passthrough();

// ネストの中のみ適用させる
// const schema = z.object({
//     user: nestSchema.passthrough() // user: { id: string; name: string; }
// });

// ネスト内外両方に適用
// const schema = z.object({
//     user: nestSchema.passthrough() // user: { id: string; name: string; }
// }).passthrough();

// validateTestData(testNestDataList);
