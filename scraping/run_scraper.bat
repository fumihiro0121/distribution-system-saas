@echo off
echo =========================================
echo ダンボールワン商品スクレイピング
echo =========================================
echo.

REM 仮想環境のチェック
if not exist venv (
    echo 仮想環境を作成中...
    python -m venv venv
)

REM 仮想環境を有効化
call venv\Scripts\activate

REM 必要なパッケージをインストール
echo.
echo パッケージをインストール中...
pip install -r requirements.txt

REM スクレイピングを実行
echo.
echo スクレイピングを開始します...
python cardboard_scraper.py

echo.
echo =========================================
echo 完了しました！
echo データは scraping\data フォルダに保存されています
echo =========================================
pause

