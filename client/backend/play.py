# yoinked initally from https://github.com/george-jensen/record-and-play-pynput/blob/main/play.py

import subprocess
from typing import List
from pynput.mouse import Button, Controller as MouseController
from pynput.keyboard import Key, Controller as KeyboardController
import time
import json
import sys
import random
import webbrowser
from localTypes import EventUnion, TypeEnum, ToggleStatus, VariableEnum
#variables that get passed should be {'name':'variable Name','value':'variable value'}


def replace_all_variables(events,savedVariables,variablesGiven):
    #decide if a var is default or overwritten
    given_dict = {v['name']: v for v in variablesGiven}
    variables = []
    for existingVariable in savedVariables:
        if existingVariable['name'] in given_dict:
            currentGiven = given_dict[existingVariable['name']]
            if existingVariable['type'] == VariableEnum.EnumText:
                currentUsed = False
                for option in existingVariable['options']:
                    if currentGiven['value'] == option:
                        variables.append(currentGiven)
                        currentUsed = True
                        break;
                #Tried to use a value not presented in options
                if not currentUsed:
                    variables.append(existingVariable)
            else:
                #Raw Text var found
                variables.append(given_dict[existingVariable['name']])
        else:
            #overwrite var not given
            variables.append(existingVariable)
    
    #find and replace variables
    for event in events:
        if event['type'] == TypeEnum.BrowserEvent:
            for var in variables:
                event['url'] = event['url'].replace('#:{}:'.format(var['name']),var['value'])
        elif event['type'] == TypeEnum.TextEvent:
            for var in variables:
                event['text'] = event['text'].replace('#:{}:'.format(var['name']),var['value'])
        elif event['type'] == TypeEnum.TerminalEvent:
            for var in variables:
                for index, _command in enumerate(event['commands']):
                    event['commands'][index] = event['commands'][index].replace('#:{}:'.format(var['name']),var['value'])

def play_events(name_of_recording,variables,number_of_plays):
    try:
        with open(name_of_recording) as json_file:
            contents = json.load(json_file)
            data:List[EventUnion] = contents['events']
            existingVariables:List[str] = contents['variables']
            replace_all_variables(data,existingVariables,variables)
    except:
        print("failed to play event due to not being able to load the file(deleted or corrupted)")
        return False
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

            elif obj['type'] == TypeEnum.TerminalEvent:
                for command in obj['commands']:
                    try:
                        subprocess.run(command)
                    except:
                        print("failed to run command:"+ command)  
            elif obj['type'] == TypeEnum.ActionEvent:
                play_events('actions/{}.txt'.format(obj['action']),obj['variables'],obj['playCount'])
            elif obj['type'] == TypeEnum.MouseMoveEvent:
                mouse.position = (obj["x"], obj["y"])
                time.sleep(0.01)   
                             
            elif obj['type'] == TypeEnum.RangeMouseMoveEvent:
                randX = random.randint(obj['x1'],obj['x2'])
                randY = random.randint(obj['y1'],obj['y2'])
                mouse.position = (randX,randY)
                time.sleep(0.01)

            elif obj["type"] == TypeEnum.MouseButtonEvent:
                if obj["toggle"] == ToggleStatus.PRESSED:
                    mouse.press(buttons[obj["button"]])
                else:
                    mouse.release(buttons[obj["button"]])

            elif obj["type"] == TypeEnum.ClickEvent:
                mouse.click(buttons[obj["button"]],obj["clickCount"])

            elif obj["type"] == TypeEnum.ClickEvent:
                mouse.click(buttons[obj["button"]],obj["clickCount"])

            elif obj["type"] == TypeEnum.MouseScrollEvent:
                horizontal_direction, vertical_direction = obj["horizontal_direction"], obj["vertical_direction"]
                mouse.scroll(horizontal_direction, vertical_direction)

            else:
                print("failed to play unrecognized obj type:",obj['type'])

