from pynput import keyboard, mouse
from flask import Flask, request
from flask_cors import CORS
from record import record_events
from play import play_events
import webbrowser
import time
import json
import os
from helpers import get_next_key, get_cord
try:
    actionFile = open("./actions.txt","r")
    actionFile.close()
except:
    print("Failed to load actions from file, creating file")
    open("./actions.txt","x")

actions = []
app = Flask(__name__)
CORS(app)
#for testing
#webbrowser.open("127.0.0.1:3334")
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

@app.route("/actions")
def getActions():
    dirList = os.listdir("./actions")
    actions = []
    for dir in dirList:
         with open("./actions/{}".format(dir),'r') as file:
            actions.append({"name":dir[:-4],"events":json.load(file)})
    return actions