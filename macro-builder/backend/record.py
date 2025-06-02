# yoinked initally from https://github.com/george-jensen/record-and-play-pynput/blob/main/record.py
from pynput import mouse
from pynput import keyboard
import time
import json
import sys


storage = []
record_all = False
def on_press(key):
    try:
        json_object = {'action':'pressed_key', 'key':key.char, '_time': time.time()}
    except AttributeError:
        if key == keyboard.Key.esc:
            return False
        json_object = {'action':'pressed_key', 'key':str(key), '_time': time.time()}
    storage.append(json_object)

def on_release(key):
    try:
        json_object = {'action':'released_key', 'key':key.char, '_time': time.time()}
    except AttributeError:
        json_object = {'action':'released_key', 'key':str(key), '_time': time.time()}
    storage.append(json_object)
        

def on_move(x, y):
    if (record_all) == True:
        if len(storage) >= 1:
            if storage[-1]['action'] != "moved":
                json_object = {'action':'moved', 'x':x, 'y':y, '_time':time.time()}
                storage.append(json_object)
            elif storage[-1]['action'] == "moved" and time.time() - storage[-1]['_time'] > 0.02:
                json_object = {'action':'moved', 'x':x, 'y':y, '_time':time.time()}
                storage.append(json_object)
        else:
            json_object = {'action':'moved', 'x':x, 'y':y, '_time':time.time()}
            storage.append(json_object)
    else:
        if len(storage) >= 1:
            if (storage[-1]['action'] == "pressed" and storage[-1]['button'] == 'Button.left') or (storage[-1]['action'] == "moved" and time.time() - storage[-1]['_time'] > 0.02):
                json_object = {'action':'moved', 'x':x, 'y':y, '_time':time.time()}
                storage.append(json_object)

def on_click(x, y, button, pressed):
    json_object = {'action':'pressed' if pressed else 'released', 'button':str(button), 'x':x, 'y':y, '_time':time.time()}
    storage.append(json_object)


def on_scroll(x, y, dx, dy):
    json_object = {'action': 'scroll', 'vertical_direction': int(dy), 'horizontal_direction': int(dx), 'x':x, 'y':y, '_time': time.time()}
    storage.append(json_object)
    

# Collect events from keyboard and mouse until esc
def recordEvents():
    global storage
    global record_all
    storage = []
    #possibly pass to user or given a option for spam of movements
    record_all = False
    with keyboard.Listener(on_press=on_press, on_release=on_release) as k_listener, mouse.Listener(on_move=on_move,on_click=on_click,on_scroll=on_scroll) as m_listener:
        k_listener.join()
        m_listener.stop()
        m_listener.join()
    return storage