
# 法藏 fazang 修法記數器

一個簡潔優雅的佛教持咒計數應用，幫助您追蹤和管理每日修行進度。

## 功能特色

- ✨ **咒語管理**：新增、編輯和管理多個咒語項目
- 📊 **計數追蹤**：記錄每次持咒的次數，支援快速計數與總數顯示
- 🎯 **目標設定**：為每個咒語設定持誦目標，顯示完成進度
- 📅 **期間統計**：設定持咒期間（起訖日期），查看期間內的進度與累計
- 📌 **置頂功能**：將重點修法項目置頂顯示，方便優先記錄
- 🔄 **歸零功能**：項目完成後可重置計數，自動記錄到試算表
- 📖 **歷史紀錄**：查看完整的持咒歷史記錄
- 👤 **個人資料**：設定修行者姓名與小組
- ☁️ **雲端同步**：支援 Google Sheets 同步，多人共修統計
- 🎨 **隨機配色**：每個項目自動分配深色識別色，便於試算表統計
- 💬 **勸世法語**：隨機顯示佛教法語，增添修行氛圍
- 🌙 **本地儲存**：所有資料儲存在本地瀏覽器，保護您的隱私

## 技術架構

- **框架**：React 19 + TypeScript
- **建置工具**：Vite 6
- **樣式**：Tailwind CSS 4 + PostCSS
- **圖示**：Lucide React
- **儲存**：LocalStorage API

## 安裝與執行

### 前置需求

- Node.js 18+ 
- npm 或 yarn

### 本地開發

1. 安裝依賴：
   ```bash
   npm install
   ```

2. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

3. 在瀏覽器開啟 `http://localhost:3000`

### 建置生產版本

```bash
npm run build
```

建置完成後，產出檔案會在 `dist` 目錄中。

### 預覽生產版本

```bash
npm run preview
```

## 專案結構

```
fazang/
├── components/          # React 元件
│   ├── BuddhaHeader.tsx         # 頂部背景與法語顯示
│   ├── DateSettingModal.tsx     # 期間設定視窗
│   ├── EditMantraModal.tsx      # 編輯項目視窗
│   ├── HistoryView.tsx          # 歷史紀錄檢視
│   ├── InputModal.tsx           # 計數輸入視窗
│   ├── SheetSettingsModal.tsx   # Google Sheets 設定
│   └── UserModal.tsx            # 使用者資料設定
├── services/           # 服務層
│   └── storage.ts      # LocalStorage 與 Google Sheets 管理
├── App.tsx             # 主應用元件
├── index.tsx           # 應用入口
├── types.ts            # TypeScript 型別定義
├── constants.ts        # 常數定義（法語、佛像圖片）
├── index.css           # 全域樣式與 Tailwind 設定
└── vite.config.ts      # Vite 配置
```

## 部署

此應用為純前端專案，可部署至任何靜態網站託管服務：

- **GitHub Pages**：已配置自動部署 workflow
- **Vercel**：`vercel --prod`
- **Netlify**：拖放 `dist` 目錄
- **其他**：上傳 `dist` 目錄至任何靜態伺服器

### GitHub Pages 部署

專案已配置 GitHub Actions 自動部署：

```bash
npm run build
git add .
git commit -m "Update"
git push
```

推送後會自動觸發 `.github/workflows/deploy.yml`，將建置結果部署到 GitHub Pages。

## Google Sheets 同步設定

1. 開啟 Google 試算表
2. 建立五個分頁，名稱分別為：
   - **第一組** (sheet1) - 台南一組的精簡資料（去重後）
   - **第二組** (sheet2) - 台南二組的精簡資料（去重後）
   - **第三組** (sheet3) - 台南三組的精簡資料（去重後）
   - **第四組** (sheet4) - 台南四組的精簡資料（去重後）
   - **紀錄** (sheet5) - 所有組別的完整歷史記錄（不去重）
3. 點選「擴充功能」→「Apps Script」
4. 貼上以下程式碼：

```javascript
function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const payload = JSON.parse(e.postData.contents);
    
    if (payload.action === 'ADD_LOG') {
      const data = payload.data;
      const userName = payload.userName || '';
      const userGroup = payload.userGroup || '';
      
      // 1. 先寫入 Sheet5「紀錄」分頁（完整歷史記錄）
      writeToRecordSheet(spreadsheet, data, userName, userGroup);
      
      // 2. 再寫入對應的組別分頁（去重處理）
      writeToGroupSheet(spreadsheet, data, userName, userGroup);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 寫入 Sheet5「紀錄」分頁（完整歷史，不去重）
function writeToRecordSheet(spreadsheet, data, userName, userGroup) {
  let recordSheet = spreadsheet.getSheetByName('紀錄');
  if (!recordSheet) {
    recordSheet = spreadsheet.insertSheet('紀錄');
  }
  
  // 初始化標題列
  if (recordSheet.getLastRow() === 0) {
    initializeSheet(recordSheet);
  }
  
  // 直接追加記錄
  recordSheet.appendRow([
    data.timestamp,
    userName,
    userGroup,
    data.mantraName,
    data.amount,
    data.totalCount
  ]);
  
  const rowIndex = recordSheet.getLastRow();
  formatRow(recordSheet, rowIndex, data.color);
}

// 寫入組別分頁（去重處理）
function writeToGroupSheet(spreadsheet, data, userName, userGroup) {
  // 根據組別選擇對應的分頁
  let sheetName = '第一組'; // 預設
  
  if (userGroup.includes('一組')) {
    sheetName = '第一組';
  } else if (userGroup.includes('二組')) {
    sheetName = '第二組';
  } else if (userGroup.includes('三組')) {
    sheetName = '第三組';
  } else if (userGroup.includes('四組')) {
    sheetName = '第四組';
  }
  
  // 取得或建立對應的分頁
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  
  // 初始化標題列
  if (sheet.getLastRow() === 0) {
    initializeSheet(sheet);
  }
  
  // 去重邏輯：檢查是否存在相同的「項目名稱、姓名、組別」
  const lastRow = sheet.getLastRow();
  let existingRowIndex = -1;
  
  if (lastRow > 1) { // 有資料行（排除標題列）
    const allData = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
    
    // 從後往前搜尋（因為相同項目通常在下方）
    for (let i = allData.length - 1; i >= 0; i--) {
      const row = allData[i];
      const rowUserName = row[1];      // B欄：使用者名稱
      const rowUserGroup = row[2];     // C欄：小組
      const rowMantraName = row[3];    // D欄：項目名稱
      
      if (rowUserName === userName && 
          rowUserGroup === userGroup && 
          rowMantraName === data.mantraName) {
        existingRowIndex = i + 2; // +2 是因為陣列從0開始，且第1列是標題
        break;
      }
    }
  }
  
  if (existingRowIndex > 0) {
    // 找到相同記錄，更新該列
    sheet.getRange(existingRowIndex, 1, 1, 6).setValues([[
      data.timestamp,
      userName,
      userGroup,
      data.mantraName,
      data.amount,
      data.totalCount
    ]]);
    formatRow(sheet, existingRowIndex, data.color);
  } else {
    // 沒有找到，新增一筆
    sheet.appendRow([
      data.timestamp,
      userName,
      userGroup,
      data.mantraName,
      data.amount,
      data.totalCount
    ]);
    const rowIndex = sheet.getLastRow();
    formatRow(sheet, rowIndex, data.color);
  }
}

// 初始化工作表（設定標題列）
function initializeSheet(sheet) {
  sheet.appendRow(['時間', '使用者名稱', '小組', '項目名稱', '變動值', '項目當前總數']);
  const headerRange = sheet.getRange(1, 1, 1, 6);
  headerRange.setFontWeight('bold');
  headerRange.setFontColor('#000000');
  headerRange.setHorizontalAlignment('center');
  
  // 凍結標題列
  sheet.setFrozenRows(1);
  
  // 設定欄位寬度
  sheet.setColumnWidth(1, 150); // 時間
  sheet.setColumnWidth(2, 100); // 使用者名稱
  sheet.setColumnWidth(3, 100); // 小組
  sheet.setColumnWidth(4, 200); // 項目名稱
  sheet.setColumnWidth(5, 80);  // 變動值
  sheet.setColumnWidth(6, 120); // 項目當前總數
}

// 格式化列樣式
function formatRow(sheet, rowIndex, color) {
  const rowRange = sheet.getRange(rowIndex, 1, 1, 6);
  rowRange.setFontColor('#000000');
  // 所有內容置中對齊
  rowRange.setHorizontalAlignment('center');
  rowRange.setVerticalAlignment('middle');
  
  // 自動調整列高
  sheet.setRowHeight(rowIndex, 25);
}

// 測試函數（可選）
function testDoPost() {
  const testPayload = {
    action: 'ADD_LOG',
    userName: '測試用戶',
    userGroup: '台南一組',
    data: {
      timestamp: '2025/12/21 14:30',
      mantraName: '懷業祈禱文',
      amount: '+108',
      totalCount: 1080,
      color: '#8B4513'
    }
  };
  
  const testEvent = {
    postData: {
      contents: JSON.stringify(testPayload)
    }
  };
  
  const result = doPost(testEvent);
  Logger.log(result.getContent());
}
```

5. 部署為網頁應用程式（執行身分：我，存取權限：任何人）
6. 複製部署網址
7. 在應用中點選設定，貼上網址

### 分頁說明

系統會自動將資料寫入對應的分頁：

#### 組別分頁（Sheet1-4）- 精簡顯示（去重）
- **台南一組** → 第一組 (sheet1)
- **台南二組** → 第二組 (sheet2)
- **台南三組** → 第三組 (sheet3)
- **台南四組** → 第四組 (sheet4)

**去重邏輯**：當「項目名稱」、「姓名」、「組別」這三個欄位都相同時，只保留最新的一筆資料（覆蓋舊資料）。這樣可以讓各組別分頁保持精簡，快速查看每個人每個項目的最新狀態。

#### 紀錄分頁（Sheet5）- 完整歷史
- **紀錄** (sheet5) - 保存所有組別的完整歷史記錄

**完整記錄**：所有的操作都會完整保存在此分頁，不進行任何去重處理。即使在組別分頁中被覆蓋的資料，在此分頁中仍然完整保留，避免因誤操作導致資料遺失。

**預設行為**：如果使用者未設定組別，資料將預設寫入「第一組」分頁。

### 小組使用方式

建立包含試算表設定的連結：
```
https://your-domain.com/?script=APPS_SCRIPT_URL&group=GROUP_NAME
```

成員從此連結進入後，可將頁面加到主畫面，之後從桌面開啟即自動連結試算表。

## 授權

MIT License

## 貢獻

歡迎提交 Issue 和 Pull Request！
