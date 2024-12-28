# LED sheduler

## 動作環境
1. Python3.7以上
2. ブラウザー
  - Chrome
  - Edge

## 追加パッケージ

1. websocket
~~~
pip install websocket
~~~

2. PySimpleGui
~~~
pip install PySimpleGUI
~~~


4. Phidget(DACドライバー)
~~~
curl -fsSL https://www.phidgets.com/downloads/setup_linux | sudo -E bash -
sudo apt update
sudo apt install libphidget22 install -y libphidget22
~~~

5. Phidget(DAC API)
~~~
pip install Phidget22
~~~

6. browser-fs-access(JS)  
ui/...に展開
~~~
git clone https://github.com/GoogleChromeLabs/browser-fs-access.git
~~~

7. jquery-ui(JS)  
以下からダウンロード
~~~
https://jqueryui.com/download/#!version=1.13.3
~~~
ui/...に展開して名前を変更

> jquery-ui-1.13… ⇒ jquery-ui



## ファイル構造
ui下は以下のファイルがあることを確認します。  
<img src="img/fig1.png" />

## 起動(Windows)
1. バッチファイルStartDriver.batを起動
2. ブラウザーでhttp://localhost:8000/index.htmlに接続

## 起動(Linux)
1. uiにてHttpdをポート8000で起動
~~~
cd ui
python -m http.server 8000
~~~
2. ドライバー起動
~~~
python ../drv/ledsch.py
~~~
3. ブラウザーでhttp://localhost:8000/index.htmlに接続


## プロトコル  
[プロトコル仕様](PROTOCOL.md)
