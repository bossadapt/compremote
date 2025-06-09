# yoinked initally from https://github.com/george-jensen/record-and-play-pynput/blob/main/play.py

from typing import List
from pynput.mouse import Button, Controller as MouseController
from pynput.keyboard import Key, Controller as KeyboardController
import time
import json
import sys
from action import EventUnion, TypeEnum, ToggleStatus

def playEvents(name_of_recording,number_of_plays):
    with open(name_of_recording) as json_file:
        data:List[EventUnion] = json.load(json_file)

    special_keys = {"Key.shift": Key.shift, "Key.tab": Key.tab, "Key.caps_lock": Key.caps_lock, "Key.ctrl": Key.ctrl, "Key.alt": Key.alt, "Key.cmd": Key.cmd, "Key.cmd_r": Key.cmd_r, "Key.alt_r": Key.alt_r, "Key.ctrl_r": Key.ctrl_r, "Key.shift_r": Key.shift_r, "Key.enter": Key.enter, "Key.backspace": Key.backspace, "Key.f19": Key.f19, "Key.f18": Key.f18, "Key.f17": Key.f17, "Key.f16": Key.f16, "Key.f15": Key.f15, "Key.f14": Key.f14, "Key.f13": Key.f13, "Key.media_volume_up": Key.media_volume_up, "Key.media_volume_down": Key.media_volume_down, "Key.media_volume_mute": Key.media_volume_mute, "Key.media_play_pause": Key.media_play_pause, "Key.f6": Key.f6, "Key.f5": Key.f5, "Key.right": Key.right, "Key.down": Key.down, "Key.left": Key.left, "Key.up": Key.up, "Key.page_up": Key.page_up, "Key.page_down": Key.page_down, "Key.home": Key.home, "Key.end": Key.end, "Key.delete": Key.delete, "Key.space": Key.space}

    mouse = MouseController()
    keyboard = KeyboardController()

    for _loop in range(number_of_plays):
        #for index, obj in enumerate(data):
        for obj in data:
            print("NEW OBJ: " + str(obj))
            if obj["type"] == TypeEnum.WaitEvent:
                time.sleep(obj["time"])
            elif obj["type"] == TypeEnum.KeyboardEvent:
                #keyboard actions
                key = obj["key"] if 'Key.' not in obj["key"] else special_keys[obj["key"]]
                print("Keyboard: Key {0}: key: {1}".format("PRESSED" if obj["toggle"] == ToggleStatus.PRESSED else "RELEASED", str(key)))
                if obj["toggle"] == ToggleStatus.PRESSED:
                    keyboard.press(key)
                else:
                    keyboard.release(key)
            else:
                #mouse actions
                #move_for_scroll = True
                #x, y = obj['x'], obj['y']
                #if action == "scroll" and index > 0 and (data[index - 1]['action'] == "pressed" or data[index - 1]['action'] == "released"):
                #    if x == data[index - 1]['x'] and y == data[index - 1]['y']:
                #        move_for_scroll = False
                print("x: {0}, y: {1}, action: {2}".format(obj["x"], obj["y"], obj["type"]))
                mouse.position = (obj["x"], obj["y"])
                #if action == "pressed" or action == "released" or action == "scroll" and move_for_scroll == True:
                #    time.sleep(0.1)
                if obj["type"] == TypeEnum.MouseButtonEvent:
                    if obj["toggle"] == ToggleStatus.PRESSED:
                        mouse.press(Button.left if obj["button"] == "Button.left" else Button.right)
                    else:
                        mouse.release(Button.left if obj["button"] == "Button.left" else Button.right)
                elif obj["type"] == TypeEnum.MouseScrollEvent:
                    horizontal_direction, vertical_direction = obj["horizontal_direction"], obj["vertical_direction"]
                    mouse.scroll(horizontal_direction, vertical_direction)

