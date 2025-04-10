/*
    【defaultとは？】
    - スキーマにデフォルト値を設定する機能

    ◆ユースケース
        1. フォームの初期値設定
        2. APIリクエストの省略フィールドにデフォルト値
        3. データベース保存前のデフォルト値適用

    【catchとは？】
    - 検証エラーをキャッチし、デフォルト値やエラーハンドリングを行う機能

    ◆ユースケース
        1. 検証エラー時にデフォルト値適用
        2. カスタムエラーメッセージの提供
        3. エラーログの記録でデバッグを容易に

    【要点】
        1. defaultはundefinedに対してデフォルト値を設定する
        2. catchはunderfinedやnull、各種エラーをキャッチしてデフォルト値を設定する
        3. defaultとcatcはが同時にある場合、defaultが優先される（順序は反映されない）
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

// 有効なテストデータ
const validTestDataListWithDefaults = [
    { titleLabel: "全て入力あり", data: { id: 1, name: "太郎" } },
    { titleLabel: "エラーパターン（idが文字列）", data: { id: "2", name: "四郎" } },
    { titleLabel: "空のデータ", data: {} },
    { titleLabel: "undefinedのデータ", data: { id: undefined, name: undefined } },
    { titleLabel: "nullのデータ", data: { id: null, name: null } },
];

/*
defaultとcatchの検証

【設定内容】
    default  id: 0 name: "デフォルト"
    catch    id: 9 name: "キャッチ"
*/

const baseSchema = z.object({
    id: z.number().int(),
    name: z.string()
});

const defaultSchema = z.object({
    id: z.number().int().default(0),
    name: z.string().default("デフォルト")
})

// const defaultSchema = z.object({
//     id: z.number().int(),
//     name: z.string()
// }).default({
//     id: 0,
//     name: "デフォルト"
// })

const catchSchema = z.object({
    id: z.number().int().catch(9),
    name: z.string().catch("キャッチ")
});

// const catchSchema = z.object({
//     id: z.number().int(),
//     name: z.string()
// }).catch({
//     id: 9,
//     name: "キャッチ"
// });

const defaultThenCatchSchema = z.object({
    id: z.number().int().default(0).catch(9),
    name: z.string().default("デフォルト").catch("キャッチ")
});

const catchThenDefaultSchema = z.object({
    id: z.number().int().catch(9).default(0),
    name: z.string().catch("キャッチ").default("デフォルト")
});

// const defaultThenCatchSchema = z.object({
//     id: z.number().int().default(0).catch(9),
//     name: z.string().default("デフォルト").catch("キャッチ")
// }).default({
//     id: 0,
//     name: "デフォルト"
// }).catch({
//     id: 9,
//     name: "キャッチ"
// });

// const catchThenDefaultSchema = z.object({
//     id: z.number().int().catch(9).default(0),
//     name: z.string().catch("キャッチ").default("デフォルト")
// }).catch({
//     id: 9,
//     name: "キャッチ"
// }).default({
//     id: 0,
//     name: "デフォルト"
// });

console.log('★★★★★ defaultとcatchの検証 ★★★★★');
console.log('');
console.log('--- 通常のスキーマ ---');
validateTestData(validTestDataListWithDefaults, baseSchema);

console.log('');
console.log('--- defaultありのスキーマ ---');
validateTestData(validTestDataListWithDefaults, defaultSchema);

console.log('');
console.log('--- catchありのスキーマ ---');
validateTestData(validTestDataListWithDefaults, catchSchema);

console.log('');
console.log('--- defaultの後にcatchのスキーマ ---');
validateTestData(validTestDataListWithDefaults, defaultThenCatchSchema);

console.log('');
console.log('--- catchの後にdefaultのスキーマ ---');
validateTestData(validTestDataListWithDefaults, catchThenDefaultSchema);