from typing import Union, List
from enum import Enum
from dataclasses import dataclass



class ToggleType(int, Enum):
    PRESSED = 0
    RELEASED = 1

@dataclass
class KeyboardEvent():
    type:ToggleType
    key:str

@dataclass
class MouseMoveEvent():
    x: int
    y: int

@dataclass
class MouseButtonEvent():
    type: ToggleType
    button: str
    x: int
    y: int

@dataclass
class MouseScrollEvent():
    vertical_direction: int
    horizontal_direction: int
    x: int
    y: int

@dataclass
class WaitEvent():
    time:float
EventUnion = Union[KeyboardEvent, MouseButtonEvent,MouseScrollEvent, WaitEvent]
 
@dataclass
class Action():
    name:str
    events: List[EventUnion]
