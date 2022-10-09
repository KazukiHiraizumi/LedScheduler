#!/usr/bin/env python

import asyncio
import websockets
import json
import time

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
        ch['value']=ts+n
        spack['events'].append(ch)
      await websocket.send(json.dumps(spack))
      try:
        events=filter(lambda o: 'value' in o, rpack['events'])
        events=filter(lambda o: 'column' in o, events)
      except Exception as e:
        pass
      else:
        for ev in events:
           print("DAout",ev['column'],ev['value'])  #Override DA output

    elif rpack['action']=='upload':
      events=filter(lambda o: 'value' in o, rpack['events'])
      events=filter(lambda o: 'column' in o, events)
      schedule=list(filter(lambda o: 'startTime' in o, events))
      with open('settings.json', 'w') as f:
        json.dump(schedule, f, indent=4)

    elif rpack['action']=='download':
      spack={'action':'upload','events':schedule}
      await websocket.send(json.dumps(spack))

async def main():
  async with websockets.serve(callback, port=8001):
    await asyncio.Future()  # run forever

try:
  with open('settings.json', 'r') as f:
    schedule=json.load(f)
except Exception as e:
  schedule=[]

print('schedule loaded',schedule)

asyncio.run(main())

