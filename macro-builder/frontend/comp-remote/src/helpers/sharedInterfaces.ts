export interface Action {
  name: string
  events: (KeyboardEvent | MouseEvent)[]
}
export interface KeyboardEvent {
  _time: number
  action: string
  key: string
}
export interface MouseEvent {
  _time: number
  action: string
  button: string
  x: number // this needs  to be a flat number(no decimals)
  y: number //this needs to be a flat number(no decimals)
}
