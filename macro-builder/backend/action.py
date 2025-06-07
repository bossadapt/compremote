from typing import Union, List
from enum import Enum
from dataclasses import dataclass, field

class ToggleStatus(int, Enum):
    PRESSED = 0
    RELEASED = 1
#because i assume comparing 1 == 1 is easier then "there  it is" == "there is is"
class TypeEnum(int, Enum):
    KeyboardEvent = 0
    MouseMoveEvent = 1
    MouseButtonEvent = 2
    MouseScrollEvent = 3
    WaitEvent = 4
@dataclass
class KeyboardEvent():
    toggle:ToggleStatus
    key:str
    type:int = field(default=TypeEnum.KeyboardEvent)
    def __init__(self,toggle,key):
        self.toggle = toggle
        self.key = key

@dataclass
class MouseMoveEvent():
    x: int
    y: int
    type:int = field(default=TypeEnum.MouseMoveEvent)

    def __init__(self,x,y):
        self.x = x
        self.y = y

@dataclass
class MouseButtonEvent():
    toggle: ToggleStatus
    button: str
    x: int
    y: int
    type:int = field(default=TypeEnum.MouseButtonEvent)

    def __init__(self,toggle,button,x,y):
        self.button = button
        self.toggle = toggle
        self.x = x
        self.y = y

@dataclass
class MouseScrollEvent():
    vertical_direction: int
    horizontal_direction: int
    x: int
    y: int
    type:int = field(default=TypeEnum.MouseScrollEvent)

    def __init__(self,vertical_direction,horizontal_direction,x,y):
        self.vertical_direction = vertical_direction
        self.horizontal_direction = horizontal_direction
        self.x = x
        self.y = y

@dataclass
class WaitEvent():
    time:float
    type : int = field(default=TypeEnum.WaitEvent)

    def __init__(self,time):
        self.time = time
EventUnion = Union[KeyboardEvent, MouseMoveEvent,MouseButtonEvent,MouseScrollEvent, WaitEvent]

@dataclass 
class Action():
    name:str
    events: List[EventUnion]
