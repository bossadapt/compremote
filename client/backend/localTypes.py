from typing import Union, List
from enum import Enum
from dataclasses import dataclass, field
import random


# Types for reciever
class RecieverStatus(int, Enum):
    OFFLINE =0,
    AWAITING_CONNECTION=1,
    ACTIVE=2

#################################################################
def generateId():
    return "id" + hex(random.getrandbits(52))[2:]
class ToggleStatus(int, Enum):
    PRESSED = 0
    RELEASED = 1

#TODO: any of the following
# add events that use selenium to control a website
# add events that call existing actions
# add a way to edit action names
# add a way to clone existing actions
# add a frontend for the reciever so that you can scan a qrcode to get the code(or add account system)
# add a way for users from the remote app to pass limited input(may cause risk)
# add a random click in a range(mostly so i get a random youtube video)
class TypeEnum(int, Enum):
    KeyEvent = 0
    MouseMoveEvent = 1
    MouseButtonEvent = 2
    MouseScrollEvent = 3
    WaitEvent = 4
    TextEvent = 5
    BrowserEvent = 6
    ClickEvent = 7 

@dataclass
class ClickEvent():
    id:str
    button:str
    x:int
    y:int
    clickCount:int
    type:int = field(default=TypeEnum.ClickEvent)    
    def __init__(self,button,x,y,clickCount):
        self.button = button
        self.x = x
        self.y = y
        self.clickCount = clickCount
        self.id = generateId()
@dataclass
class TextEvent():
    text:str
    id:str
    type:int = field(default=TypeEnum.TextEvent)    
    def __init__(self,text):
        self.text = text
        self.id = generateId()

@dataclass
class BrowserEvent():
    newWindow:bool
    url:str
    id:str
    type:int = field(default=TypeEnum.BrowserEvent)
    def __init__(self,browserType,url):
        self.browserType = browserType
        self.url = url

@dataclass
class KeyEvent():
    toggle:ToggleStatus
    key:str
    id:str
    type:int = field(default=TypeEnum.KeyEvent)
    def __init__(self,toggle,key):
        self.toggle = toggle
        self.key = key
        self.id = generateId()

@dataclass
class MouseMoveEvent():
    x: int
    y: int
    id:str
    id:str
    type:int = field(default=TypeEnum.MouseMoveEvent)

    def __init__(self,x,y):
        self.x = x
        self.y = y
        self.id = generateId()


@dataclass
class MouseButtonEvent():
    toggle: ToggleStatus
    button: str
    x: int
    y: int
    id:str
    type:int = field(default=TypeEnum.MouseButtonEvent)

    def __init__(self,toggle,button,x,y):
        self.button = button
        self.toggle = toggle
        self.x = x
        self.y = y
        self.id = generateId()

@dataclass
class MouseScrollEvent():
    vertical_direction: int
    horizontal_direction: int
    x: int
    y: int
    id:str
    type:int = field(default=TypeEnum.MouseScrollEvent)

    def __init__(self,vertical_direction,horizontal_direction,x,y):
        self.vertical_direction = vertical_direction
        self.horizontal_direction = horizontal_direction
        self.x = x
        self.y = y
        self.id = generateId()

@dataclass
class WaitEvent():
    time:float
    id:str

    type : int = field(default=TypeEnum.WaitEvent)

    def __init__(self,time):
        self.time = time
        self.id = generateId()
EventUnion = Union[TextEvent,BrowserEvent,KeyEvent, MouseMoveEvent,MouseButtonEvent,MouseScrollEvent, WaitEvent]

@dataclass 
class Action():
    name:str
    events: List[EventUnion]
