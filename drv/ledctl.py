#!/usr/bin/env python

import time
import datetime
#import PySimpleGUI as sg
import TkEasyGUI as sg

def init(dac): #DAコンをセット内包表記内包表記
  global dacon,stamps,schedule,layout,window
  dacon=dac
  cn=dac.channels()
  stamps=[time.time()]*cn
  print("stamps",stamps)
  schedule=[[] for i in range(cn)]
  print("sche",schedule)
  layout=[
    [sg.Text('CH'+str(i),size=(6,1)) for i in range(cn)],
    [sg.Text('val'+str(i),key='val'+str(i),size=(6,1),background_color='#DDDDDD',text_color='#000000') for i in range(cn)],
    [sg.Button('終了'), sg.Button('キャンセル')]]
  window = sg.Window('ドライバー', layout)

def override(ch,val):  #強制出力
  try:
    stamps[ch]=time.time()
  except Exception:
    pass
  dacon.set(ch,val)

def setsch(sch):  #スケジュール更新
  global schedule
  schedule=[[] for i in range(dacon.channels())]
  for ev in sch:
    if 'column' in ev:
      schedule[ev['column']].append(ev)
  print('setsch before')
  print(schedule)
  for i,col in enumerate(schedule):
    schedule[i]=sorted(col,key=lambda ev:ev['startTime'])
  print('setsch aft')
  print(schedule)

def update(): #出力更新
  event, values = window.read(timeout=50)
#  print("event",event)
  if event == sg.WIN_CLOSED or event == '終了':
    return False
  ts=datetime.datetime.now()
  tnow=ts.hour+ts.minute/60
  utime=time.time()
  for i in range(len(schedule)):
    col=schedule[i]
    if len(col)==0: val=0
    else:
      val=col[-1]['value']
      tlast=24
      for e in col:
        tdiff=tnow-e['startTime']
        if tdiff<0: continue
        elif tdiff<tlast:
          val=e['value']
          tlast=tdiff
    if utime-stamps[i]>2: dacon.set(i,val)
    window['val'+str(i)].update(dacon.get(i))
  return True

