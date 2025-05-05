/*
    【pipeとは？】
    - データの変換・検証を組み合わせるための便利な機能

    ◆ユースケース
        1. データの整合性を保つために、複数の検証を連続して行う
        2. データを受け取り、必要に応じて変換しながら検証を行う
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


// テストデータの準備
const validTestDataListWithPipes = [
    { titleLabel: "idが整数", data: { id: 1, name: "太郎", birthdate: "2001-01-01" } },
    { titleLabel: "idが整数の文字列", data: { id: "1", name: "太郎", birthdate: "2005-05-05" } },
];

const invalidTestDataListWithPipes = [
    { titleLabel: "IDが整数でない文字列", data: { id: "abc", name: "太郎", birthdate: "1999-12-31" } },
    { titleLabel: "名前が空文字", data: { id: 1, name: "", birthdate: "2001-01-01" } },
    { titleLabel: "生年月日が2000年以前", data: { id: 1, name: "太郎", birthdate: "1999-12-31" } },
];


/*
pipeの検証
*/

const pipeSchema = z.object({
    // 文字列または数値を受け入れ、数値に変換した後、整数であることを確認
    id: z.union([z.string(), z.number()]).pipe(z.coerce.number().int()),

    // 文字列として受け入れ、文字列の文字数に変換した後、1以上であることを確認
    name: z.string().transform((val) => val.length).pipe(z.number().min(1)),

    // 文字列として受け入れ、Dateオブジェクトに変換した後、年が2000以上であることを確認
    birthdate: z.string()
        .transform((val) => new Date(val)) // Dateオブジェクトに変換
        .pipe(z.date()) // Date型であることを確認
        .pipe(z.date().refine(date => date.getFullYear() >= 2000, {
            message: "生年月日は2000年以降でなければなりません"
        }))
});

console.log('★★★★★ pipeの検証 ★★★★★');

console.log('');
console.log('--- 成功パターン ---');
validateTestData(validTestDataListWithPipes, pipeSchema);

console.log('');
console.log('---失敗パターン ---');
validateTestData(invalidTestDataListWithPipes, pipeSchema);