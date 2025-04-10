/*
    【describeとは？】
    - スキーマに関する説明のメタデータを追加するための機能

    ◆ユースケース
        1. zodToJsonSchemaライブラリなどで生成した、JSONスキーマで文書化する場合

    【要点】
        1. zodToJsonSchemaライブラリなどでJSONの文書化をする場合は、describeを使用する
*/

import { z } from 'zod';
import { zodToJsonSchema } from "zod-to-json-schema"; // https://github.com/StefanTerdell/zod-to-json-schema


/*
【desctibeの検証】
*/


const baseSchema = z.object({
    id: z.number().int(),
    name: z.string()
});

const describeSchema = z.object({
    id: z.number().int().describe("ID"),
    name: z.string().describe("名前")
}).describe("describeSchemaの説明").default({
    id: 0,
    name: "デフォルト"
}).catch({
    id: 9,
    name: "キャッチ"
})


console.log('★★★★★ desctibeの検証 ★★★★★');
console.log('');
console.log('--- baseSchemaからJSONを生成 ---');
const jsonBaseSchema = zodToJsonSchema(baseSchema, "baseSchemaのJSONスキーマ");
console.log(JSON.stringify(jsonBaseSchema, null, 2));

console.log('');
console.log('--- describeSchemaからJSONを生成 ---');
const jsonDescribeSchema = zodToJsonSchema(describeSchema, "describeSchemaのJSONスキーマ");
console.log(JSON.stringify(jsonDescribeSchema, null, 2));