# yoinked initally from https://github.com/george-jensen/record-and-play-pynput/blob/main/record.py
from pynput import mouse
from pynput import keyboard
import time
import json
import sys
from pynput.mouse import Controller
#import threading
from typing import Union, List, Tuple
from action import KeyboardEvent,MouseButtonEvent,WaitEvent, MouseMoveEvent ,MouseScrollEvent, ToggleStatus, EventUnion
EventWithTime = Tuple[Union[KeyboardEvent, MouseButtonEvent,MouseScrollEvent],float]
storage:List[EventWithTime] = []
record_all = False
lastMoveTime:int = 0
k_listener = None
m_listener = None

def trigger_mouse_event():
    """Needs to trigger a mouse movement make the mouse listener(moves the mouse a lil)"""
    mouse = Controller()
    x, y = mouse.position
    mouse.position = (x + 1, y)
    mouse.position = (x, y)

def combine_waits_and_events() -> List[EventUnion]:
    output = []
    output.append(storage[0][0])
    for index in range(1,len(storage)):
        timeDiff = storage[index][1]-storage[index-1][1]
        if timeDiff > 0:
            output.append(WaitEvent(storage[index][1]-storage[index-1][1]))
        output.append(storage[index][0])
    return output
def on_press(key):
    global k_listener, m_listener
    try:
        storage.append((KeyboardEvent(ToggleStatus.PRESSED,key.char),time.time()))
    except AttributeError:
        if key == keyboard.Key.esc:
            k_listener.stop()
            m_listener.stop()
            return False
        storage.append((KeyboardEvent(ToggleStatus.PRESSED,str(key)),time.time()))

def on_release(key):
    try:
        storage.append((KeyboardEvent(ToggleStatus.RELEASED,key.char),time.time()))
    except AttributeError:
        storage.append((KeyboardEvent(ToggleStatus.RELEASED,str(key)),time.time()))        

def on_move(x, y):
    global lastMoveTime
    if (record_all) == True:
        if len(storage) >= 1:
            if type(storage[-1]) is MouseMoveEvent:
                storage.append((MouseMoveEvent(x,y),time.time()))
                lastMoveTime = time.time()
            elif type(storage[-1]) is MouseMoveEvent and time.time() - lastMoveTime > 0.02:
                storage.append((MouseMoveEvent(x,y),time.time()))
                lastMoveTime = time.time()
        else:
            storage.append((MouseMoveEvent(x,y),time.time()))
            lastMoveTime = time.time()
    else:
        if len(storage) >= 1:
            #for handling drags
            if type(storage[-1]) is MouseButtonEvent:
                #drag started
                if storage[-1].type == ToggleStatus.PRESSED and storage[-1].button == "Button.left":
                    storage.append((MouseMoveEvent(x,y),time.time()))
                    lastMoveTime = time.time()
                #drag ongoing
                elif (time.time() - lastMoveTime > 0.02):
                    storage.append((MouseMoveEvent(x,y),time.time()))
                    lastMoveTime = time.time()

def on_click(x, y, button, pressed):
    if(pressed):
        storage.append((MouseButtonEvent(ToggleStatus.PRESSED,str(button),x,y),time.time()))
    else:
        storage.append((MouseButtonEvent(ToggleStatus.RELEASED,str(button),x,y),time.time()))



def on_scroll(x, y, dx, dy):
    storage.append((MouseScrollEvent(dx,dy,x,y),time.time()))

# Collect events from keyboard and mouse until esc
def recordEvents() -> List[EventUnion]:
    global storage
    global record_all
    global lastMoveTime
    global k_listener
    global m_listener
    storage = []
    #possibly pass to user or given a option for spam of movements
    record_all = False
    lastMoveTime = time.time()
    with keyboard.Listener(on_press=on_press, on_release=on_release) as k_listener, mouse.Listener(on_move=on_move,on_click=on_click,on_scroll=on_scroll) as m_listener:
        k_listener.join()
        trigger_mouse_event()
        m_listener.join()
    return combine_waits_and_events()