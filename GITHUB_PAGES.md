# GitHub Pages 部署說明

## 方法一：使用 GitHub Actions（推薦）

此專案已配置 GitHub Actions 自動部署。

### 設定步驟：

1. **啟用 GitHub Pages**
   - 前往 GitHub 儲存庫設定
   - 導航到 Settings > Pages
   - 在 "Source" 下選擇 "GitHub Actions"

2. **推送代碼**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin main
   ```

3. **自動部署**
   - 每次推送到 `main` 分支時，會自動觸發部署
   - 可在 Actions 標籤頁查看部署進度

4. **訪問網站**
   - 部署完成後，網站將在以下位置可用：
   - `https://tw092669-ctrl.github.io/fazang/`

## 方法二：手動部署

使用 gh-pages 套件手動部署：

```bash
npm run deploy
```

這會建置專案並推送到 `gh-pages` 分支。

### 第一次手動部署設定：

1. 確保已安裝 gh-pages：
   ```bash
   npm install
   ```

2. 執行部署：
   ```bash
   npm run deploy
   ```

3. 在 GitHub 儲存庫設定中：
   - 前往 Settings > Pages
   - Source 選擇 "Deploy from a branch"
   - Branch 選擇 `gh-pages` 和 `/ (root)`

## 本地測試 GitHub Pages 建置

```bash
# 建置 GitHub Pages 版本
npm run build:gh-pages

# 預覽建置結果
npm run preview
```

## 注意事項

- 確保 GitHub 儲存庫設定中的 Pages 已啟用
- 如果使用 GitHub Actions，不需要手動部署
- 建置時會自動設定正確的 base path (`/fazang/`)
- 所有資料儲存在本地瀏覽器，不需要後端伺服器

## 疑難排解

### 樣式或資源未載入
檢查 base path 是否正確設定在 [vite.config.ts](vite.config.ts)

### 部署失敗
1. 檢查 GitHub Actions 日誌
2. 確認 GitHub Pages 權限已正確設定
3. 確保 `gh-pages` 分支存在且可寫入

### 404 錯誤
確保在 GitHub 儲存庫設定中正確配置了 Pages 來源
