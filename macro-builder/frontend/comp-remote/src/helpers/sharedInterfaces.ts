export interface Action {
  name: string
  events: (KeyboardEvent | MouseEvent | WaitEvent)[]
}
export interface KeyboardEvent {
  action: string
  key: string
}
export interface MouseEvent {
  action: string
  button: string
  x: number // this needs  to be a flat number(no decimals)
  y: number //this needs to be a flat number(no decimals)
}
export interface WaitEvent {
  time: number
}
