# TypeScript 検証環境

このプロジェクトはTypeScriptの検証環境です。以下の手順に従って環境を構築し、使用することができます。

## 環境構築

1. リポジトリをクローンします。
    ```bash
    git clone <リポジトリURL>
    cd <リポジトリ名>
    ```

2. 必要な依存関係をインストールします。
    ```bash
    npm install
    ```

## 使用方法

1. `make build`コマンドを実行して、`/app`配下の`src`のTypeScriptファイルをもとに、`dist`フォルダにJavaScriptファイルを生成します。
    ```bash
    make build
    ```

2. デバッグ対象のTypeScriptファイルを開いた状態で実行すると、同名のJavaScriptファイルが実行されます。
