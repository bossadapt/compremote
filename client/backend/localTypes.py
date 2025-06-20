from typing import Optional, Union, List
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
# handle backend disconnect better from macro builder
# handle disconnect from bridge better(bridge wont let reconnect)
# add more sharable forms exe/deb
# make it so the browser closes after backend failure/ disconnect to not have orphan tabs

# possible events
# call to selenium to control a website
# call to existing actions
# random click in a range(mostly so i get a random youtube video)
class TypeEnum(int, Enum):
    KeyEvent = 0
    MouseMoveEvent = 1
    MouseButtonEvent = 2
    MouseScrollEvent = 3
    WaitEvent = 4
    TextEvent = 5
    BrowserEvent = 6
    ClickEvent = 7
    TerminalEvent = 8 
    RangeMouseMoveEvent = 9

@dataclass
class TerminalEvent():
    commands:List[str]
    id:str = field(default_factory=generateId)
    type:int = field(default=TypeEnum.TerminalEvent)    

@dataclass
class RangeMouseMoveEvent():
    button:str
    x1:int
    y1:int
    x2:int
    y2:int
    id:str = field(default_factory=generateId)
    type:int = field(default=TypeEnum.TerminalEvent)   

@dataclass
class ClickEvent():
    button:str
    clickCount:int
    id:str = field(default_factory=generateId)
    type:int = field(default=TypeEnum.ClickEvent)    

@dataclass
class TextEvent():
    text:str
    id:str = field(default_factory=generateId)
    type:int = field(default=TypeEnum.TextEvent)    


@dataclass
class BrowserEvent():
    newWindow:bool
    url:str
    id:str = field(default_factory=generateId)
    type:int = field(default=TypeEnum.BrowserEvent)


@dataclass
class KeyEvent():
    toggle:ToggleStatus
    key:str
    id:str = field(default_factory=generateId)
    type:int = field(default=TypeEnum.KeyEvent)

@dataclass
class MouseMoveEvent():
    x: int
    y: int
    id:str = field(default_factory=generateId)
    type:int = field(default=TypeEnum.MouseMoveEvent)



@dataclass
class MouseButtonEvent():
    toggle: ToggleStatus
    button: str
    id:str = field(default_factory=generateId)
    type:int = field(default=TypeEnum.MouseButtonEvent)

@dataclass
class MouseScrollEvent():
    vertical_direction: int
    horizontal_direction: int
    id:str = field(default_factory=generateId)
    type:int = field(default=TypeEnum.MouseScrollEvent)

@dataclass
class WaitEvent():
    time:float
    id:str = field(default_factory=generateId)
    type : int = field(default=TypeEnum.WaitEvent)

EventUnion = Union[TextEvent,BrowserEvent,KeyEvent, MouseMoveEvent,MouseButtonEvent,MouseScrollEvent, WaitEvent, TerminalEvent]

class VariableEnum(int, Enum):
  RawText = 0,
  EnumText = 1, 

@dataclass
class Variable():
    name:str
    type:VariableEnum
    options: Optional[List[str]]
    value: str = ''

    
@dataclass 
class Action():
    name:str
    variables: List[str]
    events: List[EventUnion]
