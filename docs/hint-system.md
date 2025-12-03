# ヒントシステム仕様書

## 概要

Cursed Kiroshゲームには、プレイヤーの進行状況に応じて自動的にヒントを表示するコンテキスト対応型ヒントシステムが実装されています。このシステムは、プレイヤーが行き詰まらないようにサポートしながら、ゲーム体験を損なわないように設計されています。

## システム設定

### タイミング設定

- **非アクティブタイムアウト**: 30秒
  - プレイヤーが30秒間何も操作しない場合、非アクティブと判定
- **ヒントクールダウン**: 60秒
  - 前回のヒント表示から60秒経過しないと次のヒントは表示されない
- **チェック間隔**: 5秒
  - システムは5秒ごとにヒント表示条件をチェック

### 表示条件

ヒントが表示されるには、以下の**全ての条件**を満たす必要があります：

1. ✅ ヒントが有効化されている（`hintsEnabled = true`）
2. ✅ ゲームが完了していない（`gameComplete = false`）
3. ✅ プレイヤーが30秒間非アクティブ
4. ✅ 前回のヒント表示から60秒以上経過
5. ✅ 該当するヒントの条件を満たしている
6. ✅ そのヒントがまだ表示されていない

## 実装されているヒント一覧

### 1. Morse Basics（優先度: 100）
**ID**: `morse-basics`

**メッセージ**:
```
💡 Hint: Use the Morse Code Input buttons (DOT and DASH) to unlock new characters. Try spelling 'SOS' with what you have!
```

**表示条件**:
- モールス信号の入力履歴がない（`morseHistory.length === 0`）
- アンロック済み文字数が2文字のみ（初期状態）

**目的**: 新規プレイヤーにモールス信号の使い方を教える

---

### 2. Help Command（優先度: 90）
**ID**: `help-command`

**メッセージ**:
```
💡 Hint: Type 'help' to see available commands and get started.
```

**表示条件**:
- コマンド履歴がない（`commandHistory.length === 0`）
- helpコマンドを実行していない

**目的**: helpコマンドの存在を知らせる

---

### 3. Unlock More（優先度: 80）
**ID**: `unlock-more`

**メッセージ**:
```
💡 Hint: You've unlocked some characters! Keep using Morse code to unlock more. Each letter has a unique pattern.
```

**表示条件**:
- アンロック済み文字数が3〜9文字
- モールス信号の入力履歴がある（`morseHistory.length > 0`）

**目的**: プレイヤーの進捗を認め、継続を促す

---

### 4. Stuck with Few Characters（優先度: 85）
**ID**: `stuck-few-chars`

**メッセージ**:
```
💡 Hint: Feeling stuck? Focus on unlocking more characters through Morse code. Start with common letters like 'E' (.) or 'T' (-).
```

**表示条件**:
- アンロック済み文字数が8文字未満
- コマンド履歴が5回以上
- モールス信号の入力履歴が3回未満

**目的**: コマンドを試しているが文字をアンロックしていないプレイヤーをサポート

---

### 5. Special Commands（優先度: 75）
**ID**: `special-commands`

**メッセージ**:
```
💡 Hint: Some commands are hidden secrets. Try combinations of 'S' and 'O' like 'SOS', 'OS', 'OSS', 'SSO', or 'SOSO'.
```

**表示条件**:
- helpコマンドを実行済み
- SOSコマンドを実行していない
- アンロック済み文字数が5文字以下

**目的**: 初期文字で実行できる隠しコマンドを示唆

---

### 6. Heartbeat Unlock（優先度: 70）
**ID**: `heartbeat-unlock`

**メッセージ**:
```
💡 Hint: There's a special command that can unlock all characters at once. It's related to the sound you hear when clicking DOT...
```

**表示条件**:
- モールス信号の入力履歴が5回以上
- アンロック済み文字数が26文字未満
- heartbeatコマンドを実行していない

**目的**: 全文字アンロックのショートカットを示唆

---

### 7. Multiple Endings（優先度: 65）
**ID**: `multiple-endings`

**メッセージ**:
```
💡 Hint: This game has multiple endings! Try different commands like 'exit', 'sudo', 'treat', or 'kiro' to discover them.
```

**表示条件**:
- アンロック済み文字数が10文字以上
- 実行済みコマンド数が3回以上
- ゲームが完了していない

**目的**: 複数のエンディングの存在を知らせる

---

### 8. Echo Secret（優先度: 60）
**ID**: `echo-secret`

**メッセージ**:
```
💡 Hint: The 'echo' command can do more than just repeat text. Try echoing a classic programmer's greeting...
```

**表示条件**:
- echoコマンドを実行済み
- "echo Hello, world!"を実行していない
- アンロック済み文字数が15文字以上

**目的**: Engineer Endingへの道を示唆

---

### 9. Save Kiro（優先度: 55）
**ID**: `save-kiro`

**メッセージ**:
```
💡 Hint: You can save things in this terminal. What if you tried to save... Kiro?
```

**表示条件**:
- kiroコマンドを実行済み、**または**
- アンロック済み文字数が20文字以上かつ実行済みコマンド数が5回以上

**目的**: True Endingへの道を示唆

---

### 10. Light Mode（優先度: 50）
**ID**: `light-mode`

**メッセージ**:
```
💡 Hint: The darkness getting to you? Try the 'light' command to brighten things up.
```

**表示条件**:
- コマンド履歴が10回以上
- ライトモードが無効（`lightMode = false`）
- lightコマンドを実行していない

**目的**: ライトモード機能の存在を知らせる

---

## ヒント選択ロジック

1. **フィルタリング**: 表示条件を満たし、まだ表示されていないヒントを抽出
2. **優先度ソート**: 優先度の高い順（数値が大きい順）にソート
3. **選択**: 最も優先度の高いヒントを1つ選択
4. **表示**: システムメッセージとしてターミナルに表示
5. **記録**: 表示済みヒントとして記録（同じヒントは二度と表示されない）

## アクティビティトラッキング

以下のユーザー操作で`lastActivityTime`が更新されます：

- ✅ コマンドの送信
- ✅ モールス信号の入力（DOT/DASHボタンのクリック）
- ✅ ターミナルへの入力

## 技術実装

### ファイル構成

```
amplify-nextjs-app/
├── lib/game/
│   ├── hintSystem.ts          # ヒントロジックとヒント定義
│   ├── types.ts               # ヒント関連の型定義
│   └── gameState.ts           # ヒント状態の管理
├── hooks/
│   └── useHints.ts            # ヒント表示フック
└── components/game/
    ├── Terminal.tsx           # アクティビティトラッキング
    └── MorseInput.tsx         # アクティビティトラッキング
```

### 主要な関数

- `getNextHint(state)`: 次に表示すべきヒントを取得
- `canShowHint(state)`: ヒント表示可能かチェック
- `isPlayerInactive(state)`: プレイヤーが非アクティブかチェック
- `shouldShowHintForInactivity(state)`: 非アクティブによるヒント表示判定

### ゲームアクション

- `UPDATE_ACTIVITY`: アクティビティ時刻を更新
- `SHOW_HINT`: ヒントを表示済みとしてマーク

## 設定のカスタマイズ

ヒントシステムは`lib/game/hintSystem.ts`で設定を変更できます：

```typescript
// タイムアウト設定
export const INACTIVITY_TIMEOUT = 30000;  // 30秒
export const HINT_COOLDOWN = 60000;       // 60秒

// ヒントの追加
export const HINTS: Hint[] = [
  {
    id: 'custom-hint',
    message: 'Your custom hint message',
    condition: (state) => /* your condition */,
    priority: 50,
  },
  // ...
];
```

## テスト

ヒントシステムは包括的なユニットテストでカバーされています：

```bash
npm test -- lib/game/hintSystem.test.ts
```

テストカバレッジ:
- ✅ 非アクティブ検出
- ✅ ヒント表示可否判定
- ✅ ヒント選択ロジック
- ✅ 重複表示防止
- ✅ 優先度ソート

## プレイヤー体験への配慮

1. **押し付けがましくない**: 60秒のクールダウンで頻繁すぎる表示を防止
2. **コンテキスト対応**: プレイヤーの進行状況に応じた適切なヒント
3. **一度きり**: 同じヒントは二度と表示されない
4. **無効化可能**: `hintsEnabled`フラグで完全に無効化可能
5. **視覚的に区別**: システムメッセージとして紫色で表示

## 今後の拡張案

- [ ] ヒントの難易度設定（初心者/上級者モード）
- [ ] プレイヤーがヒントをリクエストできる機能
- [ ] ヒント表示履歴の確認機能
- [ ] 特定のヒントを再表示する機能
- [ ] ヒントの多言語対応
