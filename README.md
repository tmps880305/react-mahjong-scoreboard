# 麻將計分板 (react-mahjong-scoreboard)

仿天鳳（Tenhou）對局畫面風格的日本麻將計分板，給實體（手動打牌）麻將局使用。手機放在桌子中間，四邊玩家都能看到自己的分數，每局結束後手動輸入結果，由系統自動計算分數、莊家連莊、立直棒與本場數。

目前以網頁形式開發，未來會用 Capacitor 包裝成 Android App，因此畫面採用正方形（1:1）版面設計，並用 CSS Container Query（`cqw`）讓文字與版面比例隨實際螢幕大小縮放。

## 功能

- **對局桌面**：正方形版面，四邊各顯示一位玩家的風位與分數（對面文字旋轉180°、左右兩側旋轉90°，方便放在桌子中間給四人閱讀）
- **中央資訊**：局數（東1局等）、本場數、供託（立直棒）、殘牌數（可手動調整）、寶牌指示牌（可從麻將牌圖示選擇，支援多張）
- **記錄本局結果**：自摸 / 榮和 / 流局 / 特殊流局（四家立直、三家和等），可選擇胡牌者、放槍者、立直宣告，並用「番數 + 符數」或「直接輸入點數」兩種模式計算分數（可在設定切換），送出前有即時點數預覽
- **歷史記錄**：列出每局結果，可復原最後一手
- **設定**：玩家名稱、起始分數 / 返點、馬（Uma）、東風戰 / 半莊戰、點數輸入模式
- **對局結束**：自動計算名次與馬 + 貢分結算
- 分數會存在瀏覽器 localStorage，重新整理頁面不會遺失進度

## 技術棧

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- 純函式計分邏輯（`src/domain/`），不依賴外部麻將計分套件

## 開發

```bash
npm install
npm run dev      # 啟動開發伺服器（預設 http://localhost:5173）
npm run build    # type-check + production build
npm run lint      # eslint
npm run preview  # 預覽 production build
```

## 專案結構

```
src/
  domain/        # 計分規則、對局狀態 reducer、localStorage 存取（純邏輯，無 UI）
    scoring.ts   # 番符 -> 點數、相聽/流局罰符、馬+貢分結算
    hand.ts      # 單局結果套用：點數轉移、莊家輪替、局數推進
    reducer.ts   # 對局狀態 reducer + action 定義
    types.ts     # 共用型別
  context/       # GameContext（對局狀態的 React context）
  hooks/         # useGame()
  components/
    Table/       # 對局桌面（TableView、PlayerScoreBox、CenterPanel、寶牌選擇）
    HandInput/   # 記錄本局結果的輸入流程
    Settings/    # 設定頁
    History/     # 歷史記錄 + 復原
    GameEnd/     # 對局結束結算畫面
    common/      # 共用元件（座位選擇、數字步進器、圖示）
```

## 規則預設值

- 起始分數 25000 / 返點 30000，半莊戰（東+南各四局）
- 馬：5-10（可在設定改為 10-20、20-30 或無）
- 點數輸入預設為「番數 + 符數」，可在設定切換為「直接輸入點數」

## 待辦 / 之後計畫

- 用 Capacitor 包裝成 Android App
