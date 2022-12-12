#!/usr/bin/env python

import asyncio
import websockets
import json
import sys
import time
import PySimpleGUI as sg
import ledctl
import da_phidget as dac

async def callback(websocket):
  global schedule
  async for msg in websocket:
    rpack=json.loads(msg)

    if rpack['action']=='dump':
      spack={'action':'dump','events':[]}
      ts=int(time.strftime('%S'))
      for n in range(8):
        ch={}
        ch['column']=n
        ch['value']=dac.get(n)
        spack['events'].append(ch)
      await websocket.send(json.dumps(spack))
      try:
        events=filter(lambda o: 'value' in o, rpack['events'])
        events=filter(lambda o: 'column' in o, events)
      except Exception as e:
        pass
      else:
        for ev in events:
#           print("DAout",ev['column'],ev['value'])  #Override DA output
           ledctl.override(ev['column'],ev['value'])

    elif rpack['action']=='upload':
      events=filter(lambda o: 'value' in o, rpack['events'])
      events=filter(lambda o: 'column' in o, events)
      schedule=list(filter(lambda o: 'startTime' in o, events))
      sg.popup_auto_close('UV-LED調光ドライバー','スケジュール受信')
      with open('settings.json', 'w') as f:
        json.dump(schedule, f, indent=4)
      ledctl.setsch(schedule)

    elif rpack['action']=='download':
      spack={'action':'upload','events':schedule}
      await websocket.send(json.dumps(spack))

async def task_ctl():
  print("task_ctl start")
  if not dac.init():
    sg.popup('UV-LED調光ドライバー','DAコンバータエラー')
    sys.exit(101)

  ledctl.init(dac)
  print('schedule loaded',schedule)
  ledctl.setsch(schedule)

  while True:
    if not ledctl.update():
      feat_com.set_result('Stopped')
      break
    await asyncio.sleep(0.1)
  print("task_ctl stopped")

async def task_com():
  async with websockets.serve(callback, port=8001):
    sg.popup_auto_close('UV-LED調光ドライバー','ポート8001レディ')
    task2=loop.create_task(task_ctl())
    await feat_com  # run until 
  print("task_com stopped")

#########################################################################
try:
  with open('settings.json', 'r') as f:
    schedule=json.load(f)
except Exception as e:
  schedule=[]


feat_com=asyncio.Future()
loop=asyncio.get_event_loop()
loop.run_until_complete(loop.create_task(task_com()))

