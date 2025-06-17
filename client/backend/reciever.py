import asyncio
import os
import threading
import json
from websockets.sync.client import connect
from play import play_events
from websockets.asyncio.server import serve
from localTypes import RecieverStatus
#used to pass updates/events between the frontend and reciever
class RecieverServer:
    def __init__(self):
        print("reciever server object was created")
        self.reciever_client = RecieverClient(self)
        self.server = None
        self.loop = None
        self.clients = set()
    def run_in_background(self):
        def runner():
            asyncio.run(self.start())
        threading.Thread(target=runner, daemon=True).start()
    async def start(self):
        self.loop = asyncio.get_running_loop()
        async with serve(self.handler, "", 8001) as self.server:
            print("Starting websocket at ws://localhost:8001")
            await self.server.serve_forever()

    async def handler(self, websocket):
        self.clients.add(websocket)
        initUpdate = json.dumps({'type':"stateResponse",'status':self.reciever_client.status,'roomKey':self.reciever_client.room_key})
        await websocket.send(initUpdate)
        try:
            while True:
                message = await websocket.recv()
                message = json.loads(message)
                if message["req"] == "start":
                    print("start called on server")
                    self.reciever_client.start()
                elif message["req"] == "stop":
                    print("stop called on server")
                    self.reciever_client.stop()

        except Exception as e:
            print("Server websocket error:",e)
        finally:
            self.clients.remove(websocket)

    async def send_update(self, update):
        #sends a message to all websocket clients
        update = json.dumps(update)
        to_remove = set()
        for ws in self.clients:
            try:
                await ws.send(update)
            except Exception as e:
                print("Failed to send to a client:", e)
                to_remove.add(ws)
        # Remove unresponsives
        self.clients -= to_remove
#used to recieve updates from the server and accept commands
class RecieverClient:
    def __init__(self,reciever_server):
        self.thread = None
        self.running = False
        self.room_key = ""
        self.status = RecieverStatus.OFFLINE
        self.reciever_server = reciever_server
        self.websocket = None
    def run(self):
        self.running = True
        with connect("wss://bossadapt.org/remote/ws") as websocket:
            websocket.send("connect")
            self.websocket = websocket
            while self.running:
                try:
                    message = websocket.recv()
                    print("Received:", message)
                    message = json.loads(message)
                    if message["req"] == "init":
                        self.room_key = message["roomKey"]
                        self.status = RecieverStatus.AWAITING_CONNECTION
                        self.sendUpdate2Frontend({'type':"bridgeAwaiting",'roomKey':message["roomKey"]})
                    elif message["req"] == "close":
                        print("Server requested close.")
                        self.running = False
                    elif message["req"] == "clientConnected":
                        self.status = RecieverStatus.ACTIVE
                        self.room_key = ''
                        self.sendUpdate2Frontend({'type':"bridgeActive"})
                    elif message["req"] == "actions":
                        dirList = os.listdir("./actions")
                        actions = []
                        for dir in dirList:
                            if(dir != ".gitkeep"):
                                with open("./actions/{}".format(dir),'r') as file:
                                    fileContents =  json.load(file)
                                    actions.append({'name':dir[:-4], 'variables' : fileContents["variables"]})
                        
                        self.sendUpdate2Frontend({'type':"newRequest",'request':{'type':'actions','desc':"actions sent: {}".format(", ".join([item["name"] for item in actions]))}})
                        
                        websocket.send(json.dumps(actions))
                        print("actions list sent to server.") 
                    elif message["req"] == "play":
                        print("Server requested play of {}".format(message["action"]))
                        action = message["action"]
                        self.sendUpdate2Frontend({'type':"newRequest",'request':{'type':'play','desc':"requested play of {}".format(message["action"])}})
                        try:
                            play_events('./actions/{}.txt'.format(action['name']),action["variables"],1)
                            websocket.send("finished")
                        except Exception as e:
                            print(e)
                            websocket.send("failed to play")
                    else:
                        self.sendUpdate2Frontend({'type':"newRequest",'request':{'type':'unkownMessage','desc':"requested {}".format(message)}})
                except Exception as e:
                    print("Error:", e)
                    break
        self.sendUpdate2Frontend({'type':"bridgeOffline"})
        self.status = RecieverStatus.OFFLINE
        self.room_key = ''
        self.isRunning = False
    def sendUpdate2Frontend(self, update):
        if self.reciever_server.loop:
            asyncio.run_coroutine_threadsafe(
            self.reciever_server.send_update(update),
            self.reciever_server.loop
        )
    def isRunning(self):
        return self.running
    def start(self):
        if not self.running:
            self.thread = threading.Thread(target=self.run)
            self.thread.start()

    def stop(self):
        self.running = False
        if self.websocket != None:
            self.websocket.close()
        if self.thread:
            self.thread.join()
#TODO: make it possible to run reciever client without frontend again
#if __name__ == "__main__":
#    client = RecieverClient()
#    client.run()