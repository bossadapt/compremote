export interface Action {
  Name: String
  Events: (KeyboardEvent | MouseEvent)[]
}
export interface KeyboardEvent {}
export interface MouseEvent {}
