# サーバー起動手順

ポート3000が別のプロジェクトで使用されているため、**ポート3001**で起動します。

## 手順

### 方法1: PowerShellで起動

1. PowerShellを開く

2. frontendディレクトリに移動:
```powershell
cd c:\projects\distribution-system-saas\frontend
```

3. サーバーを起動:
```powershell
npm run dev
```

4. ブラウザで以下のURLを開く:
```
http://localhost:3001
```

### 方法2: コマンドプロンプトで起動

1. コマンドプロンプトを開く（Win + R → `cmd`）

2. frontendディレクトリに移動:
```cmd
cd c:\projects\distribution-system-saas\frontend
```

3. サーバーを起動:
```cmd
npm run dev
```

4. ブラウザで以下のURLを開く:
```
http://localhost:3001
```

### 方法3: VS Codeの統合ターミナルで起動

1. VS Codeでプロジェクトを開く

2. ターミナルを開く（Ctrl + `）

3. frontendディレクトリに移動:
```bash
cd frontend
```

4. サーバーを起動:
```bash
npm run dev
```

5. ブラウザで以下のURLを開く:
```
http://localhost:3001
```

## デモアカウント

| 役割 | メールアドレス | パスワード | URL |
|------|---------------|-----------|-----|
| 管理者 | admin@example.com | admin123 | http://localhost:3001/admin |
| フォワーダー | forwarder@example.com | forwarder123 | http://localhost:3001/forwarder |
| 梱包業者 | packing@example.com | packing123 | http://localhost:3001/packing |
| **スーパー** | **supermarket@example.com** | **super123** | **http://localhost:3001/supermarket** |

## トラブルシューティング

### サーバーが起動しない場合

1. node_modulesを再インストール:
```bash
cd c:\projects\distribution-system-saas\frontend
npm install
```

2. ポートが使用中の場合、別のポートを指定:
```bash
npm run dev -- -p 3002
```
（この場合、http://localhost:3002 でアクセス）

### 別のポートを使いたい場合

`package.json`の`scripts`セクションを編集:
```json
"dev": "next dev -p 好きなポート番号",
```

## サーバーの停止

ターミナルで `Ctrl + C` を押す

---

## 直接アクセス用URL

サーバー起動後、以下のURLで直接各画面にアクセスできます：

- **ログイン**: http://localhost:3001/login
- **管理者**: http://localhost:3001/admin
- **フォワーダー**: http://localhost:3001/forwarder
- **梱包業者**: http://localhost:3001/packing
- **スーパー**: http://localhost:3001/supermarket ⭐





