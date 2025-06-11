export enum ToggleStatus {
  PRESSED = 0,
  RELEASED = 1,
}

export enum TypeEnum {
  KeyEvent = 0,
  MouseMoveEvent = 1,
  MouseButtonEvent = 2,
  MouseScrollEvent = 3,
  WaitEvent = 4,
  TextEvent = 5,
  BrowserEvent = 6,
  ClickEvent = 7,
}
export interface ClickEvent {
  id: string
  button: string
  x: number
  y: number
  clickCount: number
  type: TypeEnum
}
export interface TextEvent {
  text: string
  id: string
  type: TypeEnum
}

export interface BrowserEvent {
  newWindow: boolean
  url: string
  id: string
  type: TypeEnum
}
export interface KeyEvent {
  id: string
  type: TypeEnum
  toggle: ToggleStatus
  key: string
}

export interface MouseMoveEvent {
  id: string
  type: TypeEnum
  x: number
  y: number
}

export interface MouseButtonEvent {
  id: string
  type: TypeEnum
  toggle: ToggleStatus
  button: string
  x: number
  y: number
}
export interface MouseScrollEvent {
  id: string
  type: TypeEnum
  vertical_direction: number
  horizontal_direction: number
  x: number
  y: number
}

export interface WaitEvent {
  id: string
  type: TypeEnum
  time: number
}

export type EventUnion =
  | KeyEvent
  | MouseButtonEvent
  | MouseMoveEvent
  | MouseScrollEvent
  | WaitEvent
  | BrowserEvent
  | TextEvent
  | ClickEvent

export interface Action {
  name: string
  events: EventUnion[]
}
