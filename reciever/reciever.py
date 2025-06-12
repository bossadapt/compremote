import asyncio
import os
import sys
import json
from websockets.sync.client import connect
sys.path.insert(0,"./../macro-builder/backend")
from play import play_events

serverConnection = None
async def recieverLoop():
    with connect("ws://localhost:5876") as websocket:
        print("Connected to server.")
        websocket.send("connect")
        roomKey = ""
        while True:
            try:
                message = websocket.recv()
                print("Received:", message)
                message = json.loads(message)
                if message["req"] == "init":
                    roomKey = message["roomKey"]
                    print("recieved room key:"+roomKey)

                elif message["req"] == "close":
                    print("Server requested close.")
                    break
                elif message["req"] == "actions":
                    print("actions list requested from server.")
                    dirList = os.listdir("./../macro-builder/backend/actions")
                    actions = []
                    for dir in dirList:
                        if(dir != ".gitkeep"):
                            actions.append(dir[:-4])
                    websocket.send(json.dumps(actions))
                    print("actions list sent to server.") 
                elif message["req"] == "play":
                    print("Server requested play of {}".format(message["action"]))
                    try:
                        play_events('actions/{}.txt'.format(message["action"]),1)
                        websocket.send("finished")
                    except Exception as e:
                        print(e)
                        websocket.send("failed to play")
                else:
                    # Handle other messages
                    print("Unknown message:", message)
            except Exception as e:
                print("Error:", e)
                break
if __name__ == "__main__":
    asyncio.run(recieverLoop())