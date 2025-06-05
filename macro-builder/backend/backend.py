from pynput import keyboard, mouse
from flask import Flask, request
from flask_restful import reqparse
from record import recordEvents
from play import playEvents
import webbrowser
import time
import json
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

@app.route("/record", methods=['GET'])
def record():
    return recordEvents()

@app.route("/play/<action_name>", methods=['GET'])
def play(action_name):
    return playEvents(action_name,1)

parser = reqparse.RequestParser()
parser.add_argument('list', type=list)
@app.route("/actions/save/<action_name>")
def saveAction(action_name):
    args = parser.parse_args()
    with open('actions/{}.txt'.format(action_name), 'w') as outfile:
                json.dump(request.data, outfile)
                
@app.route("/actions/")
def getActions():
    return {"status": "healthy"}