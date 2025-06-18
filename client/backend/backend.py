import subprocess
import sys
from flask import Flask, request
from flask_cors import CORS
from record import record_events
from play import play_events
import time
import json
import webbrowser
import os
import signal
from reciever import RecieverServer
from singles import get_next_key, get_cord, get_next_button

app = Flask(__name__)
CORS(app)
#initialize frontend
process = subprocess.Popen(
    ["npx","serve", "-s", "dist"],
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

#open a websocket to allow the user to activate and monitor the online bridge
reciever_server = RecieverServer()
reciever_server.run_in_background()
@app.route("/")
def helloWorld():
    return {"status": "healthy"}

@app.route("/record", methods=['GET'])
def record():
    return record_events()

@app.route("/actions/play/", methods=['PATCH'])
def play():
    data = request.get_json()
    action_name = data['name']
    play_events('actions/{}.txt'.format(action_name),[],1)
    return {"status": "finished"}

@app.route("/actions/save/", methods=['PATCH'])
def saveAction():
    data = request.get_json()
    print(data)
    action_name = data['name']
    events = data['events']
    variables = data['variables']
    with open('actions/{}.txt'.format(action_name), 'w') as outfile:
                json.dump({"variables":variables,"events":events}, outfile)
    return {"status": "finished"}

@app.route("/actions/rename/", methods=['PATCH'])
def renameAction():
    data = request.get_json()
    oldName = data['old']
    newName = data['new']
    os.rename("./actions/{}.txt".format(oldName),"./actions/{}.txt".format(newName))
    return {"status": "finished"}

@app.route("/actions/remove/", methods=['DELETE'])
def removeAction():
    data = request.get_json()
    action_name = data['name']
    os.remove("./actions/{}.txt".format(action_name))
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
    for fileNameWithExt in dirList:
        if(fileNameWithExt != ".gitkeep"):
             with open("./actions/{}".format(fileNameWithExt),'r') as file:
                 fileContents =  json.load(file)
                 actions.append({"name":fileNameWithExt[:-4],"variables":fileContents["variables"],"events":fileContents["events"]})
    return actions