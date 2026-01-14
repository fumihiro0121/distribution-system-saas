# ポート設定について

## 重要なお知らせ

このプロジェクトは**ポート3001**で起動するように設定されています。

理由: ポート3000が別のプロジェクト（Mamoru商標登録システム）で使用されているため。

## 起動方法

### Windows PowerShell

```powershell
# frontendディレクトリに移動
cd c:\projects\distribution-system-saas\frontend

# サーバーを起動（自動的にポート3001で起動）
npm run dev
```

### ブラウザでアクセス

```
http://localhost:3001
```

## デモアカウント

すべてのデモアカウントでポート3001を使用します：

- **管理者**: http://localhost:3001/admin
  - メール: admin@example.com
  - パスワード: admin123

- **フォワーダー**: http://localhost:3001/forwarder
  - メール: forwarder@example.com
  - パスワード: forwarder123

- **梱包業者**: http://localhost:3001/packing
  - メール: packing@example.com
  - パスワード: packing123

- **スーパー**: http://localhost:3001/supermarket ⭐
  - メール: supermarket@example.com
  - パスワード: super123

## ポート変更方法

別のポートを使いたい場合は、`package.json`を編集：

```json
{
  "scripts": {
    "dev": "next dev -p 好きなポート番号"
  }
}
```

例えば、ポート4000を使いたい場合：
```json
"dev": "next dev -p 4000"
```

## トラブルシューティング

### ポート3001も使用中の場合

1. 一時的に別のポートで起動：
```bash
npm run dev -- -p 3002
```

2. または、使用中のプロセスを停止：
```bash
# ポート3001を使用しているプロセスを確認
netstat -ano | findstr :3001

# プロセスIDを確認してタスクマネージャーで終了
```

### サーバーが起動しない

1. node_modulesを再インストール：
```bash
rm -rf node_modules
npm install
```

2. Next.jsのキャッシュをクリア：
```bash
rm -rf .next
npm run dev
```

## 本番環境

本番環境では環境変数でポートを指定できます：

```bash
# .envファイル
PORT=3001
```

または

```bash
# コマンドライン
PORT=3001 npm run start
```





