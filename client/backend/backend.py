import subprocess
import sys
import threading
from flask import Flask, request, send_from_directory
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

env = os.environ.get("ENV", "prod")
basePathForActions = os.path.expanduser('~/.local/share/compremote')

os.makedirs(basePathForActions, exist_ok=True)
 
if getattr(sys, 'frozen', False):
    # We're in a PyInstaller bundle
    static_folder = os.path.join(sys._MEIPASS, "dist")
else:
    # We're running from source
    static_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/comp-remote/dist"))


#global flask app
if env == 'prod':
    app = Flask(__name__, static_folder=static_folder, static_url_path="/")
else:
    app = Flask(__name__)

#whether the frontend will be served by flask or npm run dev
if env == 'prod':
    @app.route("/")
    def index():
        return send_from_directory(app.static_folder, "index.html")

    @app.route("/<path:path>")
    def serve_static(path):
        return send_from_directory(app.static_folder, path)
else :
    process = subprocess.Popen(["npm","run","dev"],cwd="./../frontend/comp-remote")
    def cleanup(signum, frame):
        process.terminate()
        process.wait()
        sys.exit(0)
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)


@app.route("/record", methods=['GET'])
def record():
    return record_events()

@app.route("/actions/play/", methods=['PATCH'])
def play():
    data = request.get_json()
    action_name = data['name']
    play_events(basePathForActions+'/{}.txt'.format(action_name),[],1)
    return {"status": "finished"}

@app.route("/actions/save/", methods=['PATCH'])
def saveAction():
    data = request.get_json()
    print(data)
    action_name = data['name']
    events = data['events']
    variables = data['variables']
    with open(basePathForActions+'/{}.txt'.format(action_name), 'w') as outfile:
                json.dump({"variables":variables,"events":events}, outfile)
    return {"status": "finished"}

@app.route("/actions/rename/", methods=['PATCH'])
def renameAction():
    data = request.get_json()
    oldName = data['old']
    newName = data['new']
    os.rename(basePathForActions+'/{}.txt'.format(oldName),basePathForActions+'/{}.txt'.format(newName))
    return {"status": "finished"}

@app.route("/actions/remove/", methods=['DELETE'])
def removeAction():
    data = request.get_json()
    action_name = data['name']
    os.remove(basePathForActions+'/{}.txt'.format(action_name))
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
    dirList = os.listdir(basePathForActions)
    actions = []
    for fileNameWithExt in dirList:
        if(fileNameWithExt != ".gitkeep"):
             with open(basePathForActions+'/{}'.format(fileNameWithExt),'r') as file:
                 fileContents =  json.load(file)
                 actions.append({"name":fileNameWithExt[:-4],"variables":fileContents["variables"],"events":fileContents["events"]})
    return actions

def runServer():
    if env == "prod":
        from waitress import serve
        serve(app, port=3334)

    else:
        app.run(port=3334)

if __name__ == "__main__":
    CORS(app)

    #bridge connection
    reciever_server = RecieverServer()
    reciever_server.run_in_background()
    #api connection
    server_thread = threading.Thread(target=runServer, daemon=True)
    server_thread.start()
    time.sleep(1)

    if env == "prod":
        webbrowser.open("http://localhost:3334")
    else:
        webbrowser.open("http://localhost:5173")

    server_thread.join()
