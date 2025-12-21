# 法藏 fazang 修法記數器專案打包清單

## ✅ 已完成項目

### 1. 依賴管理
- ✅ Tailwind CSS 4.1.18
- ✅ @tailwindcss/postcss 4.1.18
- ✅ PostCSS 8.5.6
- ✅ Autoprefixer 10.4.23
- ✅ gh-pages（用於部署）

### 2. 配置文件
- ✅ [.gitignore](.gitignore) - 完整的 Git 忽略規則
- ✅ [postcss.config.js](postcss.config.js) - PostCSS 配置
- ✅ [tailwind.config.js](tailwind.config.js) - Tailwind CSS 配置
- ✅ [index.css](index.css) - 全域樣式與 Tailwind 導入
- ✅ [vite.config.ts](vite.config.ts) - Vite 建置配置（含 GitHub Pages 支援）

### 3. 文件檔案
- ✅ [README.md](README.md) - 專案說明（中文）
- ✅ [LICENSE](LICENSE) - MIT 授權
- ✅ [DEPLOY.md](DEPLOY.md) - 部署指南
- ✅ [GITHUB_PAGES.md](GITHUB_PAGES.md) - GitHub Pages 詳細說明

### 4. GitHub Actions
- ✅ [.github/workflows/deploy.yml](.github/workflows/deploy.yml) - 自動部署 workflow

### 5. 打包腳本
```json
{
  "dev": "vite",                          // 開發伺服器
  "build": "vite build",                   // 標準建置
  "build:gh-pages": "GITHUB_PAGES=true vite build",  // GitHub Pages 建置
  "preview": "vite preview",               // 預覽建置結果
  "deploy": "npm run build:gh-pages && gh-pages -d dist"  // 手動部署
}
```

## 🚀 部署方式

### 自動部署（推薦）
1. 在 GitHub 儲存庫設定中啟用 Pages（Source: GitHub Actions）
2. 推送代碼到 `main` 分支
3. GitHub Actions 會自動建置並部署

**網址**: https://tw092669-ctrl.github.io/fazang/

### 手動部署
```bash
npm run deploy
```

## 📦 建置驗證

✅ 建置成功：`npm run build`
```
✓ 1710 modules transformed.
dist/index.html                   0.51 kB
dist/assets/index-*.css          28.20 kB
dist/assets/index-*.js          233.02 kB
```

✅ GitHub Pages 建置成功：`npm run build:gh-pages`
- Base path 正確設定為 `/fazang/`
- 資源路徑正確：`/fazang/assets/*`

## 🎯 下一步

1. **推送到 GitHub**：
   ```bash
   git add .
   git commit -m "完成 GitHub Pages 配置"
   git push origin main
   ```

2. **啟用 GitHub Pages**：
   - 前往 Settings > Pages
   - Source 選擇 "GitHub Actions"

3. **等待部署完成**：
   - 查看 Actions 標籤頁
   - 部署完成後訪問網站

## 📝 技術棧

- React 19.2.3
- TypeScript 5.8.2
- Vite 6.2.0
- Tailwind CSS 4.1.18
- Lucide React 0.562.0

## 🔒 隱私與安全

- 所有資料儲存在本地 LocalStorage
- 無需後端伺服器
- 無需環境變數或 API 金鑰
- 完全靜態網站
