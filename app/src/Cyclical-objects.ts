/*
【循環参照とは？】
循環参照は、オブジェクトが直接または間接的に自分自身を参照する構造です。
例えば、オブジェクトAがオブジェクトBを参照し、オブジェクトBが再びオブジェクトAを参照する場合が該当します。

/*
【循環参照の問題点】
1. メモリリーク:
   循環参照が発生すると、ガベージコレクタがオブジェクトを解放できなくなり、メモリリークが発生する可能性があります。

2. 無限ループ:
   循環参照を含むデータ構造を操作する際に、無限ループに陥る可能性があります。
   例えば、循環参照を含むオブジェクトを再帰的に処理する関数が無限に実行されることがあります。

3. デバッグの難しさ:
   循環参照が存在する場合、デバッグが難しくなります。
   オブジェクトの内容を確認する際に、循環参照が原因でスタックオーバーフローやメモリ不足が発生することがあります。

4. データのシリアライズ:
   循環参照を含むオブジェクトをJSON.stringifyなどでシリアライズする際にエラーが発生します。
   これにより、データの保存や通信が困難になります。

これらの問題を回避するためには、循環参照を避けるか、適切に処理する必要があります。例えば、Zodの`z.lazy`を使用して循環参照を安全に定義することができます。


【Zodでの循環参照】
- Zodスキーマ内で循環参照が発生することがあります。これは、スキーマが自己参照する構造を持つ場合に起こります。
- Zodの`z.lazy`を使用することで、循環参照を解決できます。`z.lazy`はスキーマの評価を遅延させ、循環構造を安全に定義することを可能にします。
*/

import { z } from 'zod';

// テストデータの検証
function validateTestData(testDataList: { data: unknown; titleLabel: string }[], schema: z.ZodType<unknown>) {
    console.log('【実行結果】');
    for (const { data, titleLabel } of testDataList) {
        try {
            const parseSchema = schema.parse(data);
            console.log(`○成功: ${titleLabel} IN: ${safeStringify(data)} -> OUT: ${safeStringify(parseSchema)} `);
        } catch (e: unknown) {
            if (e instanceof z.ZodError) {
                console.error(`×失敗: ${titleLabel} IN: ${safeStringify(data)} -> OUT: ${e.name} `);
            } else {
                console.error(`×失敗: ${titleLabel} IN: ${safeStringify(data)} -> OUT: ${e} `);
            }
        }
    }
}

// この関数は、循環参照を持つオブジェクトを安全に文字列に変換するためのものです。
// WeakSetを使って、すでに処理したオブジェクトを記録し、循環参照が見つかった場合には"[Circular]"という文字列を返します。
function safeStringify(obj: unknown): string {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
        // オブジェクトであり、かつnullでない場合に処理を行う
        if (typeof value === "object" && value !== null) {
            // 既にWeakSetに含まれている場合は循環参照と判断し、"[Circular]"を返す
            if (seen.has(value)) {
                return "[Circular]";
            }
            // まだWeakSetに含まれていない場合は追加し、次回以降の循環参照を検出できるようにする
            seen.add(value);
        }
        return value;
    });
}

const testDataList = [
    { titleLabel: "正常データ", data: { a: 1, b: 2 } },
    { titleLabel: "循環データ", data: (() => { const obj: { a: number; b?: any } = { a: 1 }; obj.b = obj; return obj; })() }  // オブジェクト `obj` のプロパティ `b` が `obj` 自身を参照
];



// 循環を通してしまうスキーマ
const nonCyclicalSchema = z.object({
    a: z.number(),
    b: z.number().optional()
});

// 循環を通してしまうスキーマ
const throwCyclicalSchema = z.object({
    a: z.number(),
    b: z.any()
});

// 再起的な値を許可するスキーマ
const cyclicalSchema: z.ZodType<unknown> = z.lazy(() =>
    z.object({
        a: z.number(),
        b: z.union([z.lazy(() => cyclicalSchema), z.number()]) // 循環参照を許可
    })
);


console.log('--- 循環非対応スキーマでの検証 ---');
validateTestData(testDataList, nonCyclicalSchema);

console.log('--- 循環を通してしまうスキーマでの検証 ---');
validateTestData(testDataList, throwCyclicalSchema);

console.log('--- 再起的な値を許可するスキーマ ---');
validateTestData(testDataList, cyclicalSchema);