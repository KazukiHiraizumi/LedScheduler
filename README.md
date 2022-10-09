# LED sheduler

## 動作環境
1. Python3.x
2. ブラウザー
  - Chrome
  - Edge

## 追加パッケージ

1. websocket
~~~
pip install websocket
~~~

## テスト  
1. ポート8000でHttpd起動
~~~
python -m http.server 8000
~~~
2. scheduler起動
~~~
python drv/ledsch.py
~~~
3. ブラウザーでhttp://localhost:8000/ex1.htmlに接続


## プロトコル  
[プロトコル仕様](PROTOCOL.md)