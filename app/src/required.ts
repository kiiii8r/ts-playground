/* 
【requiredメソッドとは？】
- zodOptionalを解除し、必須にするプロパティを指定するメソッド （partialメソッドの逆）

【ユースケース】
- Zodobjectスキーマが多要素かつ、必須項目が少ない場合
- 必須を明示したい時（ユーザー表示に合わせる）

【要点】
- ZodObjectで使用
- ネストしたZodObjectには適用されない
- ZodObjectスキーマのkeyには使用できない 
- 未指定のプロパティの扱いはデフォルト同様
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
  { titleLabel: "全て", data: { id: "456", name: "Alice", age: 30 } },
  { titleLabel: "nameがない", data: { id: "456", age: 25 } },
  { titleLabel: "nameのみ", data: { name: "Bob" } },
  { titleLabel: "idのみ", data: { id: "789" } },
  { titleLabel: "未指定のプロパティを含む", data: { id: "456", name: "Alice", age: 30, newPropaty: "新規プロパティ" } },
];

// ZodObjectからのみ各プロパティに適用可能
// const schema = z.object({
//   id: z.string().required(),  
//   name: z.string().optional().required(),
//   age: z.number().optional(), 
// }).required(); // ここで使用

// 変化なし
const schema = z.object({
    id: z.string(),   // id: string;
    name: z.string(), // name: string;
    age: z.number(),  // age: number;
  }).required();

// 以下のObjectの要素は全てzodOptionalに設定しrequiredで検証

//　全て必須になる
// const schema = z.object({
//     id: z.string(),   // id: string;
//     name: z.string(), // name: string;
//     age: z.number(),  // age: number;
//   }).partial().required();

/*
  複数の要素を必須（idとname）

  必須項目をユーザの画面表示と同様に指定できる
    ・名前　　※必須
    ・年齢　　※任意
*/
// const schema = z.object({
//   id: z.string(),   // id: string;
//   name: z.string(), // name: string;
//   age: z.number(),  // age?: number | undefined;
// }).partial().required({ id: true, name: true });

// 必須でないことを明示はできない
// const schema = z.object({
//   id: z.string(),
//   name: z.string(),
//   age: z.number(),
// }).partial().required({ name: true, id: false });

// ZodEffectsにOptionalを使用し、必須のプロパティを指定するとZodEffectsに戻る
// const schema = z.object({
//   id: z.string().refine((val) => val === "123" || val === "456" || val === "789", {
//     message: "idは123, 456, 789のいずれかでなければなりません",
//   }),
//   name: z.string().refine((val) => val === "Alice" || val === "Bob" || val === "Charlie" || val === "David", {
//     message: "nameはAlice, Bob, Charlie, Davidのいずれかでなければなりません",
//   }),
//   age: z.number().refine((val) => val >= 20 && val <= 40, {
//     message: "ageは20から40の間でなければなりません",
//   }),
// }).partial().required();

validateTestData(testDataList);


// ネストあり
const testNestDataList = [
  { titleLabel: "全て", data: { user: { id: "123", name: "Alice", age: 30 } } },
  { titleLabel: "nameがない", data: { user: { id: "456", age: 25 } } },
  { titleLabel: "nameのみ", data: { user: { name: "Bob" } } },
  { titleLabel: "idのみ", data: { user: { id: "789" } } },
];

const nestSchema = z.object({
  id: z.string(),   // id: string;
  name: z.string(), // name: string;
  age: z.number(),  // age: number;
});

// ネストの中には適用されない
// const schema = z.object({
//   user: nestSchema // user: { id: string; name: string; age: number; }
// }).deepPartial().required({ user: true });

// ZodObjectスキーマのkeyには使用できない
// const schema = z.object({
//   user: nestSchema.partial().required({user: true})
// })

// ネストしたZodObjectであれば適用可能
// const schema = z.object({
//   user: nestSchema.partial().required({name: true}) // user: { id: string; name?: string | undefined ; age: number; }
// })

// validateTestData(testNestDataList);


// lineMessageのテストデータ
const lineMessageDataList = [
  { titleLabel: "text", data: { type: "text", text: "Hello, World!" } },
  { titleLabel: "image", data: { type: "image", originalContentUrl: "https://example.com/original.jpg", previewImageUrl: "https://example.com/preview.jpg" } },
  { titleLabel: "video", data: { type: "video", originalContentUrl: "https://example.com", previewVideoUrl: "https://example.com" } },
  { titleLabel: "textがない", data: { type: "text" } },
]

/*
  １つの項目の値によって必須プロパティが変わる場合はrefineを使用
  ・typeがtextの場合、textは必須
  ・typeがimageの場合、originalContentUrlとpreviewImageUrlは必須
  ・typeがvideoの場合、originalContentUrlは必須
*/
// const schema = z.object({
//   type: z.enum(["text", "image", "video"]), // type: "text" | "image" | "video";
//   text: z.string(),                         // text?: string;
//   originalContentUrl: z.string().url(),     // originalContentUrl?: string;
//   previewImageUrl: z.string().url(),        // previewImageUrl?: string;
//   previewVideoUrl: z.string().url(),        // previewVideoUrl?: string;
//   }).partial().refine((data) => {
//       if (data.type === "text" && !data.text) {
//           return false;
//       }
//       if (data.type === "image" && (!data.originalContentUrl || !data.previewImageUrl)) {
//           return false;
//       }
//       if (data.type === "video" && (!data.originalContentUrl || !data.previewVideoUrl)) {
//           return false;
//       }
//           return true;
//   }, {
//       message: "必須プロパティが不足しています",
// });

// validateTestData(lineMessageDataList);