from Phidget22 import Phidget as device
from Phidget22.Devices import VoltageOutput as dac
import time

#Serials=[590215,589305]    #Board serial number
Serials=[717149]
Calib=5/100.0 #Calibraion

Values=[0]*len(Serials)*4
Dacs=[None]*len(Serials)*4

def init():
  global Dacs
  for cn in range(len(Serials)):
    dev=dac.VoltageOutput()
    dev.setChannel(0)
    try:
      dev.openWaitForAttachment(5000)
    except Exception as e:
      return False
    sn=dev.getDeviceSerialNumber()
    base=0
    for sr in Serials:
      if sn==sr:
        print("Phidget DAC found",sn,base)
        break
      base=base+4;
    Dacs[base]=dev
    for n in [1,2,3]:
      dev=dac.VoltageOutput()
      dev.setChannel(n)
      dev.openWaitForAttachment(5000)
      Dacs[base+n]=dev
  return True

def channels():
  return len(Dacs)

def set(ch,val):
  global Values
  v=float(val)
  Values[ch]=v
  Dacs[ch].setVoltage(Calib*v)

def get(ch):
  return Values[ch]

#init()
#
#init()
#
#Dacs[0].setVoltage(1)
#Dacs[1].setVoltage(2)
#Dacs[2].setVoltage(3)
#Dacs[3].setVoltage(4)
#Dacs[4].setVoltage(1.5)
#Dacs[5].setVoltage(2.5)
#Dacs[6].setVoltage(3.5)
#Dacs[7].setVoltage(4.5)


#time.sleep(60)


