# 
プロフェッショナルな名刺を簡単に作成できるWebアプリケーションです。

## 機能

- **リアルタイムプレビュー**: 入力した情報が即座に名刺に反映されます
- **複数のテンプレート**: クラシック、モダン、ミニマル、クリエイティブの4つのテンプレート
- **カラーテーマ**: ブルー、グリーン、レッド、パープル、オレンジの5つのカラーテーマ
- **ダウンロード機能**: 作成した名刺をHTMLファイルとしてダウンロード
- **レスポンシブデザイン**: スマートフォンやタブレットでも使用可能
- **キーボードショートカット**: 効率的な操作が可能

## 技術仕様

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **バックエンド**: Java Servlet 6.0
- **Webサーバー**: Apache Tomcat 10
- **Java バージョン**: Java 21
- **ビルドツール**: Maven

## セットアップ

### 前提条件

- Java 21 以上
- Apache Tomcat 10
- Maven 3.6 以上

### インストール手順

1. プロジェクトをクローンまたはダウンロード
```bash
git clone <repository-url>
cd business-card-app
```

2. Mavenでプロジェクトをビルド
```bash
mvn clean package
```

3. Tomcatにデプロイ
   - `target/business-card-app.war` をTomcatの `webapps` ディレクトリにコピー
   - Tomcatを起動

4. ブラウザでアクセス
```
http://localhost:8080/business-card-app/
```

### 開発用サーバー起動

Maven Tomcatプラグインを使用して開発サーバーを起動できます：

```bash
mvn tomcat7:run
```

その後、ブラウザで `http://localhost:8080/business-card/` にアクセスしてください。

## 使用方法

### 基本的な使い方

1. **情報入力**: フォームに名刺の情報を入力
   - 氏名（必須）
   - 会社名
   - 役職
   - 電話番号
   - メールアドレス
   - 住所
   - Webサイト

2. **テンプレート選択**: 4つのテンプレートから選択
   - クラシック: シンプルで伝統的なデザイン
   - モダン: グラデーションを使用した現代的なデザイン
   - ミニマル: 余白を重視したシンプルなデザイン
   - クリエイティブ: カラフルで個性的なデザイン

3. **カラーテーマ選択**: 5つのカラーテーマから選択
   - ブルー、グリーン、レッド、パープル、オレンジ

4. **プレビュー確認**: 右側のプレビューエリアで名刺の見た目を確認

5. **ダウンロード**: 「ダウンロード」ボタンをクリックして名刺を保存

### 便利な機能

- **サンプルデータ**: 「サンプルデータ」ボタンでテスト用データを入力
- **クリア**: 「クリア」ボタンでフォームをリセット
- **リアルタイム更新**: 入力内容が自動的にプレビューに反映

### キーボードショートカット

- `Ctrl+P` (Mac: `Cmd+P`): プレビュー更新
- `Ctrl+S` (Mac: `Cmd+S`): ダウンロード
- `Ctrl+R` (Mac: `Cmd+R`): サンプルデータ入力
- `Ctrl+C` (Mac: `Cmd+C`): フォームクリア

## ファイル構成

```
business-card-app/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── businesscard/
│       │           └── app/
│       │               └── BusinessCardServlet.java
│       └── webapp/
│           ├── css/
│           │   └── style.css
│           ├── js/
│           │   └── app.js
│           ├── WEB-INF/
│           │   └── web.xml
│           └── index.html
├── pom.xml
└── README.md
```

## カスタマイズ

### 新しいテンプレートの追加

1. `src/main/webapp/css/style.css` に新しいテンプレートのスタイルを追加
2. `src/main/webapp/index.html` のテンプレート選択オプションに追加
3. `src/main/java/com/businesscard/app/BusinessCardServlet.java` の `generateHTMLContent` メソッドにスタイルを追加

### 新しいカラーテーマの追加

1. `src/main/webapp/css/style.css` に新しいカラーテーマのスタイルを追加
2. `src/main/webapp/index.html` のカラーテーマ選択オプションに追加
3. `src/main/java/com/businesscard/app/BusinessCardServlet.java` の `generateHTMLContent` メソッドにスタイルを追加

## トラブルシューティング

### よくある問題

1. **Tomcatが起動しない**
   - Java 21がインストールされているか確認
   - JAVA_HOME環境変数が正しく設定されているか確認

2. **アプリケーションにアクセスできない**
   - Tomcatが正常に起動しているか確認
   - ポート8080が使用可能か確認
   - ファイアウォールの設定を確認

3. **ダウンロード機能が動作しない**
   - ブラウザのポップアップブロッカーを無効化
   - JavaScriptが有効になっているか確認

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 貢献

プルリクエストやイシューの報告を歓迎します。

## 更新履歴

- v1.0.0: 初回リリース
  - 基本的な名刺作成機能
  - 4つのテンプレート
  - 5つのカラーテーマ
  - ダウンロード機能 
