import subprocess
import sys
from pynput import keyboard, mouse
from flask import Flask, request
from flask_cors import CORS
from record import record_events
from play import play_events
import time
import json
import webbrowser
import os
import signal

from singles import get_next_key, get_cord, get_next_button

app = Flask(__name__)
CORS(app)
#initialize frontend
process = subprocess.Popen(
    ["npm", "run", "dev"],
    cwd="./../frontend/comp-remote"
)

#delayed cleanup listening for ctrl+c or sys shutdown or killed
def cleanup(signum, frame):
    global process
    process.terminate()
    process.wait()
    sys.exit(0)

signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)
time.sleep(1)

#open the window to display
webbrowser.open("http://localhost:5173")

@app.route("/")
def helloWorld():
    return {"status": "healthy"}

@app.route("/record", methods=['GET'])
def record():
    return record_events()

@app.route("/actions/play/<action_name>", methods=['GET'])
def play(action_name):
    play_events('actions/{}.txt'.format(action_name),1)
    return {"status": "finished"}

@app.route("/actions/save/<action_name>", methods=['PATCH'])
def saveAction(action_name):
    data = request.get_json()
    with open('actions/{}.txt'.format(action_name), 'w') as outfile:
                json.dump(data, outfile)
    return {"status": "finished"}

@app.route("/actions/remove/<action_name>", methods=['DELETE'])
def removeAction(action_name):
    os.remove("./actions/{}{}".format(action_name,".txt"))
    return {"status": "finished"}
@app.route("/getKey")
def getKey():
     return get_next_key()

@app.route("/getCord")
def getCord():
    return get_cord()
@app.route("/getButton")
def getButton():
     return get_next_button()
@app.route("/actions")
def getActions():
    dirList = os.listdir("./actions")
    actions = []
    for dir in dirList:
         with open("./actions/{}".format(dir),'r') as file:
            if(dir != ".gitkeep"):
                actions.append({"name":dir[:-4],"events":json.load(file)})
    return actions