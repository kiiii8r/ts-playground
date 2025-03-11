/* 
【ZodのRecordsについて】
- ZodRecordは、キーが文字列で値が任意の型のオブジェクトを表すスキーマ
- ZodRecordは、ZodObjectの特殊なケースで、キーが文字列であることが保証されている

【ユースケース】
- キーが可変のデータの場合（APIのレスポンスなど）
- 値が全て同じ型指定のオブジェクトの場合（可読性向上、環境変数など）

【要点】
- ZodRecordの方指定は、keyはstringのみ（JSの仕様）、valueは任意の型
- ZodObjectに使用できるメソッドは使用できない
- ZodRecordsは、ZodOptionalでいう、patialかつstrictの状態となる （指定した値が欠けるのはOK）
*/

import { z } from "zod";

// キーが number の場合、キーが string に変換される
// JavaScript はすべてのオブジェクトキーを内部の文字列に自動的にキャストするため、ZodRecordのキーは常に文字列
// const testMap: { [k: number]: string } = {
//     1: "one",
//     '2': "two",
// };
// for (const key in testMap) {
//     console.log(`${key}: ${typeof key}`); // prints: `1: string`
// }


/*
    各種パターンの検証
*/
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

// キーと値が特定の型
const testDataList = [
    { titleLabel: "idのみ(全てstring)", data: { id: "1" } },
    { titleLabel: "idとname(全てstring)", data: { id: "1", name: "Alice" } },
    { titleLabel: "idとname(全てint）", data: { id: 1, name: 2 } },
    { titleLabel: "未指定のプロパティを含む(全てstring)", data: { id: "1", name: "Charlie", newPropaty: "新規プロパティ" } },
    { titleLabel: "idがint", data: { id: 1, name: "Alice" } },
    { titleLabel: "nameのキーがint", data: { id: "1", 1: "Alice" } },
];

// すべての値が string であることを保証
// const schema = z.record(z.string());

// recordを使わずにobjectで指定する場合
// const schema = z.object({
//     id: z.string(),
//     name: z.string(),
// });

// z.object内にz.recordは使えない
// const schema = z.object(
//     z.record(
//         z.string()
//     )
// );

// z.record内に.z.objectとz.recordは使える
// const schema = z.record(
//     z.object({
//         id: z.string(),
//         name: z.string(),
//     }),
//     z.record(z.string(), z.string(), z.string())
// );

// keyに制約をかけることもできる
// ZodOptionalの、patialかつstrictの状態となる
// ZodObjectに使用できるメソッドは使用できない
// const schema = z.record(
//     z.enum(["id", "name"]),
//     z.string()
// );

// const schema = z.object({
//     id: z.string(),
//     name: z.string(),
// }).partial().strict();

// validateTestData(testDataList);


// z.record内は3つまでできる（３つ目の引数については時間が取れず今回はスキップ）
// const schema = z.record(z.string(), z.string(), z.string());
// const schema1 = z.record(z.string(), z.string(), z.string(), z.string());

// ネストの検証用データ
const nestedTestDataList = [
    { titleLabel: "ネストされたオブジェクト(全てstring)", data: { "1": "1", "2": "2", "3": "3" } },
    { titleLabel: "ネストされたオブジェクト(全てnumber)", data: { "1": 1, "2": 2, "3": 3 } },
    { titleLabel: "ネストされたオブジェクト(全てnumber)", data: { "1": 1, "2": 2, "3": { "3": 2 } } },
];

// ネストバージョンのスキーマ
// const schema = z.record(
//     z.string(),
//     z.number(),
//     z.boolean(),
// );

// validateTestData(nestedTestDataList);


/*
    【ユースケース１】
    APIレスポンスのバリデーション（キーが動的に変わる）
*/
const testApiDataList = [
    { titleLabel: "１度目のリクエスト", data: {"post-1": { title: "１度目のリクエスト", views: 100 }}},
    { titleLabel: "２度目のリクエスト", data: {"post-2": { title: "２度目のリクエスト", views: 200 }}},
    // 以下キーがpost-3, post-4...のように続く
];

// const schema = z.record(
//     z.object({
//         title: z.string(),
//         views: z.number(),
//     })
// );

// validateTestData(testApiDataList); 



/*
    【ユースケース２】
    環境変数のバリデーション（値の型が全て同じ）
*/
const testEnvDataList = [
    { titleLabel: "stringの環境変数のみ", data: { ENV_VAR_STR_1: "value1", ENV_VAR_STR_2: "value2", ENV_VAR_STR_3: "value3", ENV_VAR_STR_4: "value4", ENV_VAR_STR_5: "value5", ENV_VAR_STR_6: "value6", ENV_VAR_STR_7: "value7"} },
    { titleLabel: "全ての環境変数が設定されていない", data: {} },
];

// const schema = z.object({
//     ENV_VAR_STR_1: z.string(),
//     ENV_VAR_STR_2: z.string(),
//     ENV_VAR_STR_3: z.string(),
//     ENV_VAR_STR_4: z.string(),
//     ENV_VAR_STR_5: z.string(),
//     ENV_VAR_STR_6: z.string(),
//     ENV_VAR_STR_7: z.string(),
// });

// const schema = z.record(
//     z.enum([
//         "ENV_VAR_STR_1",
//         "ENV_VAR_STR_2",
//         "ENV_VAR_STR_3",
//         "ENV_VAR_STR_4",
//         "ENV_VAR_STR_5",
//         "ENV_VAR_STR_6",
//         "ENV_VAR_STR_7",
//     ]),
//     z.string()
// );

// validateTestData(testEnvDataList);