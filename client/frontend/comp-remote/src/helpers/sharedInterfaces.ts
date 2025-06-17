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
  x: number = 0
  y: number = 0

  constructor(id: string, button?: string, toggle?: ToggleStatus, x?: number, y?: number) {
    this.id = id
    if (button !== undefined) this.button = button
    if (toggle !== undefined) this.toggle = toggle
    if (x !== undefined) this.x = x
    if (y !== undefined) this.y = y
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
  x: number = 0
  y: number = 0

  constructor(id: string, vDir?: number, hDir?: number, x?: number, y?: number) {
    this.id = id
    if (vDir !== undefined) this.vertical_direction = vDir
    if (hDir !== undefined) this.horizontal_direction = hDir
    if (x !== undefined) this.x = x
    if (y !== undefined) this.y = y
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

export class ClickEvent {
  id: string
  type: TypeEnum = TypeEnum.ClickEvent
  button: string = 'Button.left'
  x: number = 0
  y: number = 0
  clickCount: number = 1

  constructor(id: string, button?: string, x?: number, y?: number, clickCount?: number) {
    this.id = id
    if (button !== undefined) this.button = button
    if (x !== undefined) this.x = x
    if (y !== undefined) this.y = y
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
export class Variable {
  name: string = ''
  value: string = ''
  constructor(name?: string, defaultValue?: string) {
    if (name) this.name = name
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

export interface Action {
  name: string
  variables: Variable[]
  events: EventUnion[]
}
