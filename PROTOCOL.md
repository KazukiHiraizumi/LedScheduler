# ドライバープロトコル
## パケット構造
<table>
<tr><th>キー<th>値<th>Description
<tr><td>action<td><td>このパケットが意図する動作を示します。actionキー値によって、eventsキー値の意味合いが規定されます。
<tr><td><td>upload<td>eventsキーの値はスケジュールです。スケジュールデータのフォーム詳細は後述
<tr><td><td>download<td>このパケットは現在実行中のスケジュールを送信することを要求します。eventsキー値は、存在したとしても無視されます。
<tr><td><td>dump<td>eventsキーの値は、各チャネルの出力値です。ドライバーがこのパケットを受信した場合、現在の出力値の通知要求と解釈します。さらにもしactionキー値が存在する場合は出力をその内容に応じて更します。<br>クライアントがこのパケットを受信した場合、現在の出力値の通知と解釈します。
<tr><td>events<td>[{...},{...}...]<td>eventsキーは、ObjectのArrayにて、各request/responseに必要な情報が記述されます。
</table>

## eventsキー値の詳細
### upload  
<table>
<tr><th>キー<th>値<th>Description
<tr><td>column<td>0::7 :int<td>このオブジェクトのチャンネル
<tr><td>startTime<td>0.00::24.00 :float<td>起点時刻を0:00とした経過時間。このキーが省略された場合は、valuキーの値が即時に出力されます。
<tr><td>value<td>0::100 :int<td>デューティ値
</table>
例1. 下記のパケットをドライバーへ送ると「8:30にCH1を80%に切替え」「19:45にCH5を20%に切替え」スケジュール設定が行われます。

~~~
{
  'action':'upload',
  'events':[
    {'column':1,'startTime':8.5,'value':80},
    {'column':5,'startTime':19.75,'value':20}
  ]
}
~~~
また同パケットを受信した場合は、現在スケジュール設定と解釈します。

### download  
<table>
<tr><td>無視
</table>
例1. 下記のパケットをドライバーへ送ると、スケジュールの読み出しが行われます。応答はactionキー値が"upload"のパケットがドライバーから送信されるはずです。

~~~
{
  'action':'download',
}
~~~

### dump
<table>
<tr><th>キー<th>値<th>Description
<tr><td>column<td>int:0::7<td>このオブジェクトのチャンネル
<tr><td>value<td>int:0::100<td>デューティ値
</table>


例1. 下記のパケットをドライバーへ送ると、出力値の通知が行われます。
~~~
{
  'action':'dump'
}
~~~

例2. 下記のパケットをドライバーへ送ると、「CH1に80%」「CH5に20%」を即座に出力します。また出力値の通知も行われます。
~~~
{
  'action':'dump',
  'events':[
    {'column':1,'value':80},
    {'column':5,'value':20}
  ]
}
~~~

また同パケットを受信した場合は、「CH1に80%」「CH5に20%」が現在出力と解釈します。
