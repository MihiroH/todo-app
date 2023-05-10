# Todo-App

## 主な技術スタック
### フロントエンド
フロントエンドはfrontendディレクトリの中にあるので、そちらを参照してください。  
[frontend/README.md](frontend/README.md)
### バックエンド
| 名称                                                                  | バージョン |
| --------------------------------------------------------------------- | ---------- |
| [Docker](https://www.docker.com/)                                     | 20.10.8    |
| [PHP](https://www.php.net/)                                           | 8.1.18     |
| [Composer](https://getcomposer.org/)                                  | 2.5.1      |
| [Laravel](https://laravel.com/)                                       | ^10.8      |
| [PHPUnit](https://phpunit.de/)                                        | ^10.1      |
| [MySQL](https://www.mysql.com/)                                       | 8.0        |

## セットアップ
バックエンドとフロントエンドを初期化します。
1. バックエンドの環境変数を設定
```
$ cp .env.example .env
```
2. バックエンドのtest用の環境変数を設定
```
$ cp .env.example .env.testing
```
3. `.env.testing`を編集  
`DB_DATABASE=testing`に変更
4. フロントエンドの環境変数を設定
```
$ cp ./frontend/.env.example ./frontend/.env
```
5. バックエンドとフロントエンドを初期化  
[Composer](https://getcomposer.org/)がインストールされている必要があります。
```
$ make
```
6. DBのテーブルを作成
```
$ make migrate-init
```
7. テーブルに適当なデータを追加
```
$ make db-seed
```

## コマンド一覧 (バックエンド)
| コマンド| 概要 | 説明 |
| ------- | ---- | ---- |
| `make serve-api` | ローカルサーバー起動 | Dockerコンテナを作成 & 起動 |
| `make stop-api` | ローカルサーバー停止 | Dockerサービスを停止 |
| `make down-api` | ローカルサーバー停止 & 削除 | Dockerコンテナとネットワークを停止 & 削除 |
| `make test-api` | テスト実行 | Featureテスト、Unitテストなど |
| `make migrate-up` | マイグレーション実行 | DBのテーブルやカラム、インデックスの追加 |
| `make db-seed` | DBにデータをシード | DBのテーブルに適当なデータを追加 |

## コマンド一覧 (フロントエンド)
| コマンド| 概要 | 説明 |
| ------- | ---- | ---- |
| `make serve-app` | ローカルサーバー起動 | Ctrl+cで停止可能 |
| `make build-app` | ビルド | distフォルダ内に吐き出される |
| `make lint-app` | ソースコードのLint | |
