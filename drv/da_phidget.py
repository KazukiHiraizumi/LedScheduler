#!/usr/bin/env python

value=[0]*8

def init():
  return True

def channels():
  return 8

def set(ch,val):
  value[ch]=val

def get(ch):
  return value[ch]

