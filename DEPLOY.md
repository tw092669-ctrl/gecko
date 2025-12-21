# 部署指南

## 打包專案

```bash
npm run build
```

## 部署選項

### 1. Vercel 部署

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### 2. Netlify 部署

1. 前往 [Netlify](https://app.netlify.com)
2. 點擊 "Add new site" > "Deploy manually"
3. 拖放 `dist` 目錄

或使用 Netlify CLI：
```bash
# 安裝 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod --dir=dist
```

### 3. GitHub Pages 部署

在 `package.json` 中添加：
```json
{
  "homepage": "https://<username>.github.io/<repo-name>",
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

安裝 gh-pages：
```bash
npm install --save-dev gh-pages
```

部署：
```bash
npm run deploy
```

### 4. 傳統主機部署

1. 執行 `npm run build`
2. 將 `dist` 目錄中的所有文件上傳至伺服器
3. 確保伺服器配置支援 SPA（單頁應用）路由

## 環境變數

此專案不需要環境變數，所有資料儲存在本地瀏覽器。

## 建置檢查清單

- ✅ 安裝依賴：`npm install`
- ✅ 執行建置：`npm run build`
- ✅ 本地預覽：`npm run preview`
- ✅ 檢查 `dist` 目錄是否正確生成
- ✅ 測試所有功能是否正常運作
- ✅ 確認樣式和字體正確載入
