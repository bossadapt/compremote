export enum ToggleStatus {
  PRESSED = 0,
  RELEASED = 1,
}
export enum RecieverStatus {
  OFFLINE = 0,
  AWAITING_CONNECTION = 1,
  ACTIVE = 2,
}
export enum TypeEnum {
  //Is only ever used for making other event types and does not exist in the backend
  Clone = -1,
  //Directly copied from backend events
  KeyEvent = 0,
  MouseMoveEvent = 1,
  MouseButtonEvent = 2,
  MouseScrollEvent = 3,
  WaitEvent = 4,
  TextEvent = 5,
  BrowserEvent = 6,
  ClickEvent = 7,
  TerminalEvent = 8,
  RangeMouseMoveEvent = 9,
  ActionEvent = 10,
}

export class TerminalEvent {
  id: string
  type: TypeEnum = TypeEnum.TerminalEvent
  commands: string[] = []
  constructor(id: string, key?: string, commands?: string[]) {
    this.id = id
    if (commands !== undefined) this.commands = commands
  }
}

export class KeyEvent {
  id: string
  type: TypeEnum = TypeEnum.KeyEvent
  toggle: ToggleStatus = ToggleStatus.PRESSED
  key: string = 'Key.space'

  constructor(id: string, key?: string, toggle?: ToggleStatus) {
    this.id = id
    if (key !== undefined) this.key = key
    if (toggle !== undefined) this.toggle = toggle
  }
}

export class MouseButtonEvent {
  id: string
  type: TypeEnum = TypeEnum.MouseButtonEvent
  toggle: ToggleStatus = ToggleStatus.RELEASED
  button: string = 'Button.left'

  constructor(id: string, button?: string, toggle?: ToggleStatus) {
    this.id = id
    if (button !== undefined) this.button = button
    if (toggle !== undefined) this.toggle = toggle
  }
}

export class MouseMoveEvent {
  id: string
  type: TypeEnum = TypeEnum.MouseMoveEvent
  x: number = 0
  y: number = 0

  constructor(id: string, x?: number, y?: number) {
    this.id = id
    if (x !== undefined) this.x = x
    if (y !== undefined) this.y = y
  }
}

export class MouseScrollEvent {
  id: string
  type: TypeEnum = TypeEnum.MouseScrollEvent
  vertical_direction: number = 0
  horizontal_direction: number = 0

  constructor(id: string, vDir?: number, hDir?: number) {
    this.id = id
    if (vDir !== undefined) this.vertical_direction = vDir
    if (hDir !== undefined) this.horizontal_direction = hDir
  }
}

export class TextEvent {
  id: string
  type: TypeEnum = TypeEnum.TextEvent
  text: string = ''

  constructor(id: string, text?: string) {
    this.id = id
    if (text !== undefined) this.text = text
  }
}

export class BrowserEvent {
  id: string
  type: TypeEnum = TypeEnum.BrowserEvent
  newWindow: boolean = false
  url: string = 'https://google.com'

  constructor(id: string, url?: string, newWindow?: boolean) {
    this.id = id
    if (url !== undefined) this.url = url
    if (newWindow !== undefined) this.newWindow = newWindow
  }
}
export class ActionEvent {
  action: string = ''
  variables: Variable[] = []
  playCount: number = 1
  id: string
  type: TypeEnum = TypeEnum.ActionEvent
  constructor(id: string, action?: string, variables?: Variable[], playCount?: number) {
    this.id = id
    if (action !== undefined) this.action = action
    if (variables !== undefined) this.variables = variables
    if (playCount !== undefined) this.playCount = playCount
  }
}
export class ClickEvent {
  id: string
  type: TypeEnum = TypeEnum.ClickEvent
  button: string = 'Button.left'
  clickCount: number = 1

  constructor(id: string, button?: string, clickCount?: number) {
    this.id = id
    if (button !== undefined) this.button = button
    if (clickCount !== undefined) this.clickCount = clickCount
  }
}

export class WaitEvent {
  id: string
  type: TypeEnum = TypeEnum.WaitEvent
  time: number = 0

  constructor(id: string, time?: number) {
    this.id = id
    if (time !== undefined) this.time = time
  }
}
export class RangeMouseMoveEvent {
  id: string
  type: TypeEnum = TypeEnum.RangeMouseMoveEvent
  x1: number = 0
  y1: number = 0
  x2: number = 0
  y2: number = 0

  constructor(id: string, x1?: number, y1?: number, x2?: number, y2?: number) {
    this.id = id
    if (x1 !== undefined) this.x1 = x1
    if (y1 !== undefined) this.y1 = y1
    if (x2 !== undefined) this.x2 = x2
    if (y2 !== undefined) this.y2 = y2
  }
}

export enum VariableEnum {
  RawText = 0,
  EnumText = 1,
}
export class Variable {
  name: string = ''
  type: VariableEnum = VariableEnum.RawText
  value: string = ''
  options?: string[] = undefined
  constructor(type?: VariableEnum, name?: string, defaultValue?: string) {
    if (name) this.name = name
    if (type) this.type = type
    if (defaultValue) this.value = defaultValue
  }
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
  | TerminalEvent
  | RangeMouseMoveEvent
  | ActionEvent

export interface Action {
  name: string
  variables: Variable[]
  events: EventUnion[]
}
export interface ClientSideAction {
  name: string
  variables: Variable[]
}
