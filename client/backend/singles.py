from pynput import keyboard, mouse
listener = None
def get_next_key():
    """Captures the next key pressed and returns it as {"key":"f"}."""
    global listener
    key_pressed = {"key":"f"}
    def on_press(key):
        global listener
        nonlocal key_pressed
        try:
            key_pressed["key"] = str(key.char) 
        except AttributeError:
            key_pressed["key"] = str(key)
        listener.stop()
    with keyboard.Listener(on_press=on_press) as listener:
        listener.join()

    return key_pressed
def get_next_button():
    """Captures the next button pressed and returns it as {"button" : "button.left"}."""
    global listener
    button_pressed = {"button":"Button.left"}
    def on_click(x, y, button, pressed):
        global listener
        if(pressed):
            button_pressed["button"] = str(button)
            listener.stop()
    with mouse.Listener(on_click=on_click) as listener:
        listener.join()
    return button_pressed
def get_cord():
    """Returns one {x:0,y:0} object after they click left-mouse."""
    global listener
    cord = {"x":0,"y":0}
    def on_click(x, y, button, pressed):
        global listener
        if(str(button) == "Button.left" and pressed):
            cord["x"] = x
            cord["y"] = y
            listener.stop()
    with mouse.Listener(on_click=on_click) as listener:
        listener.join()
    return cord
