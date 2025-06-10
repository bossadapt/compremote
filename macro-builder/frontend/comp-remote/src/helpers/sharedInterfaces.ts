export enum ToggleStatus {
  PRESSED = 0,
  RELEASED = 1,
}

export enum TypeEnum {
  KeyboardEvent = 0,
  MouseMoveEvent = 1,
  MouseButtonEvent = 2,
  MouseScrollEvent = 3,
  WaitEvent = 4,
}

export interface KeyboardEvent {
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
  | KeyboardEvent
  | MouseButtonEvent
  | MouseMoveEvent
  | MouseScrollEvent
  | WaitEvent
export interface Action {
  name: string
  events: EventUnion[]
}
