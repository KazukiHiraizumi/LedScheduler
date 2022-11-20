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

3. Phidget(DAコンバータ)
~~~
pip install Phidget22
~~~

4. browser-fs-access(JS)
5. jquery-ui-1.13.2(JS)

## ディレクトリ構造
追加パッケージ(JS)は以下のように配置します。
<img src="img/fig1.png" />

## テスト  
1. ポート8000でHttpd起動
~~~
python -m http.server 8000
~~~
2. ドライバー起動
~~~
python drv/ledsch.py
~~~
3. ブラウザーでhttp://localhost:8000/ui/index.htmlに接続


## プロトコル  
[プロトコル仕様](PROTOCOL.md)