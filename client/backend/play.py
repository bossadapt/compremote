# yoinked initally from https://github.com/george-jensen/record-and-play-pynput/blob/main/play.py

from typing import List
from pynput.mouse import Button, Controller as MouseController
from pynput.keyboard import Key, Controller as KeyboardController
import time
import json
import sys
import webbrowser
from localTypes import EventUnion, TypeEnum, ToggleStatus

def play_events(name_of_recording,number_of_plays):
    with open(name_of_recording) as json_file:
        data:List[EventUnion] = json.load(json_file)
    special_keys = {"Key.shift": Key.shift, "Key.tab": Key.tab, "Key.caps_lock": Key.caps_lock, "Key.ctrl": Key.ctrl, "Key.alt": Key.alt, "Key.cmd": Key.cmd, "Key.cmd_r": Key.cmd_r, "Key.alt_r": Key.alt_r, "Key.ctrl_r": Key.ctrl_r, "Key.shift_r": Key.shift_r, "Key.enter": Key.enter, "Key.backspace": Key.backspace, "Key.f19": Key.f19, "Key.f18": Key.f18, "Key.f17": Key.f17, "Key.f16": Key.f16, "Key.f15": Key.f15, "Key.f14": Key.f14, "Key.f13": Key.f13, "Key.media_volume_up": Key.media_volume_up, "Key.media_volume_down": Key.media_volume_down, "Key.media_volume_mute": Key.media_volume_mute, "Key.media_play_pause": Key.media_play_pause, "Key.f6": Key.f6, "Key.f5": Key.f5, "Key.right": Key.right, "Key.down": Key.down, "Key.left": Key.left, "Key.up": Key.up, "Key.page_up": Key.page_up, "Key.page_down": Key.page_down, "Key.home": Key.home, "Key.end": Key.end, "Key.delete": Key.delete, "Key.space": Key.space}
    buttons = { "Button.left": Button.left,"Button.right": Button.right,"Button.middle": Button.middle,"Button.button8": Button.button8,"Button.button9": Button.button9,"Button.button10": Button.button10,"Button.button11": Button.button11,"Button.button12": Button.button12,"Button.button13": Button.button13,"Button.button14": Button.button14,"Button.button15": Button.button15,"Button.button16": Button.button16,"Button.button17": Button.button17,"Button.button18": Button.button18,"Button.button19": Button.button19,"Button.button20": Button.button20,"Button.button21": Button.button21,"Button.button22": Button.button22,"Button.button23": Button.button23,"Button.button24": Button.button24,"Button.button25": Button.button25,"Button.button26": Button.button26,"Button.button27": Button.button27,"Button.button28": Button.button28,"Button.button29": Button.button29,"Button.button30": Button.button30,"Button.scroll_down": Button.scroll_down,"Button.scroll_left": Button.scroll_left,"Button.scroll_right": Button.scroll_right,"Button.scroll_up": Button.scroll_up}    
    mouse = MouseController()
    keyboard = KeyboardController()

    for _loop in range(number_of_plays):
        #for index, obj in enumerate(data):
        for obj in data:
            print("NEW OBJ: " + str(obj))
            if obj["type"] == TypeEnum.WaitEvent:
                time.sleep(obj["time"])
            elif obj["type"] == TypeEnum.KeyEvent:
                #keyboard actions
                key = obj["key"] if 'Key.' not in obj["key"] else special_keys[obj["key"]]
                print("Keyboard: Key {0}: key: {1}".format("PRESSED" if obj["toggle"] == ToggleStatus.PRESSED else "RELEASED", str(key)))
                if obj["toggle"] == ToggleStatus.PRESSED:
                    keyboard.press(key)
                else:
                    keyboard.release(key)
            elif obj["type"] == TypeEnum.TextEvent:
                keyboard.type(obj["text"])
            elif obj["type"] == TypeEnum.BrowserEvent:
                if obj["newWindow"]:
                    webbrowser.open_new(obj["url"])
                else:
                    webbrowser.open_new_tab(obj["url"])                
            else:
                print("x: {0}, y: {1}, action: {2}".format(obj["x"], obj["y"], obj["type"]))
                mouse.position = (obj["x"], obj["y"])
                #added to allow it to get into position before performing actions
                time.sleep(0.01)
                print("in mouse action")
                if obj["type"] == TypeEnum.MouseButtonEvent:
                    if obj["toggle"] == ToggleStatus.PRESSED:
                        mouse.press(buttons[obj["button"]])
                    else:
                        mouse.release(buttons[obj["button"]])
                elif obj["type"] == TypeEnum.ClickEvent:
                    mouse.click(buttons[obj["button"]],obj["clickCount"])
                elif obj["type"] == TypeEnum.MouseScrollEvent:
                    horizontal_direction, vertical_direction = obj["horizontal_direction"], obj["vertical_direction"]
                    mouse.scroll(horizontal_direction, vertical_direction)

