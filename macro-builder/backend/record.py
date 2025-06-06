# yoinked initally from https://github.com/george-jensen/record-and-play-pynput/blob/main/record.py
from pynput import mouse
from pynput import keyboard
import time
import json
import sys
#import threading
from typing import Union, List, Tuple
from action import KeyboardEvent,MouseButtonEvent,WaitEvent, MouseMoveEvent ,MouseScrollEvent, ToggleType, EventUnion
EventWithTime = Tuple[Union[KeyboardEvent, MouseButtonEvent,MouseScrollEvent],float]
storage:List[EventWithTime] = []
record_all = False
lastMoveTime:int = 0
k_listener = None
m_listener = None
#TODO: make all this faster, there is no reason for the large delay between entering the combine function from the escape key
def combine_waits_and_events() -> List[EventUnion]:
    print("entered the combinator: {}", time.time())
    output = []
    output.append(storage[0][0])
    for index in range(1,len(storage)):
        timeDiff = storage[index][1]-storage[index-1][1]
        if timeDiff > 0:
            output.append(WaitEvent(storage[index][1]-storage[index-1][1]))
        output.append(storage[index][0])
    print("exiting combinator, time : {}", time.time())
    return output
def on_press(key):
    global k_listener, m_listener
    try:
        storage.append((KeyboardEvent(ToggleType.PRESSED,key.char),time.time()))
    except AttributeError:
        if key == keyboard.Key.esc:
            print("Escape was pressed, time : {}", time.time())
            k_listener.stop()
            m_listener.stop()
            return False
        storage.append((KeyboardEvent(ToggleType.PRESSED,str(key)),time.time()))


def on_release(key):
    try:
        storage.append((KeyboardEvent(ToggleType.RELEASED,key.char),time.time()))
    except AttributeError:
        storage.append((KeyboardEvent(ToggleType.RELEASED,str(key)),time.time()))        

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
                if storage[-1].type == ToggleType.PRESSED and storage[-1].button == "Button.left":
                    storage.append((MouseMoveEvent(x,y),time.time()))
                    lastMoveTime = time.time()
                #drag ongoing
                elif (time.time() - lastMoveTime > 0.02):
                    storage.append((MouseMoveEvent(x,y),time.time()))
                    lastMoveTime = time.time()


def on_click(x, y, button, pressed):
    if(pressed):
        storage.append((MouseButtonEvent(ToggleType.PRESSED,str(button),x,y),time.time()))
    else:
        storage.append((MouseButtonEvent(ToggleType.RELEASED,str(button),x,y),time.time()))



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
        m_listener.join()
    return combine_waits_and_events()