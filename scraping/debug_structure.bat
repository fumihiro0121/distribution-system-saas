@echo off
echo =========================================
echo ページ構造デバッグツール
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

REM デバッグスクリプトを実行
echo.
echo ページ構造を分析中...
python debug_page_structure.py

echo.
echo =========================================
echo 完了しました！
echo 結果は scraping\data\page_structure.html を確認してください
echo =========================================
pause






