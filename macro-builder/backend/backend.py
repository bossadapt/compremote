from pynput import keyboard, mouse
from flask import Flask
from action import Action
import webbrowser
import time
try:
    actionFile = open("./actions.txt","r")
    actionFile.close()
except:
    print("Failed to load actions from file, creating file")
    open("./actions.txt","x")

actions = []
app = Flask(__name__)
webbrowser.open("127.0.0.1:5000")
@app.route("/")
def helloWorld():
    return {"status": "healthy"}

@app.route("/record")
def record():
    #listener outputs
    mouseActions = []
    keyboardActions = []
    #throttle for mouse movements to not to take up so much space
    lastOnMove = time.time()
    #TODO: allow user to set how much mouse updates will spam the feed
    mouseMoveUpdateRate = 1/5
    def on_move(x, y):
        nonlocal lastOnMove
        if(time.time()-lastOnMove > mouseMoveUpdateRate):
            lastOnMove = time.time()
            mouseActions.append(('move', x, y))
    def on_click(x, y, button, pressed):
        mouseActions.append(('click', x, y, str(button), pressed))
    def on_scroll(x, y, dx, dy):
        mouseActions.append(('scroll', x, y, dx, dy))
    #keyboard handling
    def on_press(key):
        try:
            k = key.char
        except AttributeError:
            k = str(key)
        keyboardActions.append(('press', k))
        # Stop recording if 'a' is pressed
        if k == 'Key.esc':
            keyboardActions.pop()
            return False

    with keyboard.Listener(on_press=on_press) as k_listener, mouse.Listener(on_move=on_move,on_click=on_click,on_scroll=on_scroll) as m_listener:
        k_listener.join()
        m_listener.stop()
        m_listener.join()

    actionMade = Action("testName",keyboardActions,mouseActions)
    return actionMade.to_dict()

@app.route("/actions")
def getActions():
    return {"status": "healthy"}