import { WebSocket, WebSocketServer } from "ws";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
console.log("building Websocket");

//Websocket to user device they wish to send existing macros to
const wss = new WebSocketServer({ port: 5876 });
// frontend server URL base
const host = "http://localhsot:5173";
class Client {
  roomKey: string;
  webSocket: WebSocket | undefined;
  jwt: undefined | string = undefined;
  constructor(roomKey: string, webSocket: WebSocket, jwt: string | undefined) {
    this.roomKey = roomKey;
    this.webSocket = webSocket;
    this.jwt = jwt;
  }
}

//2 seperate maps from the two seperate endpoints
const activeClients = new Map<string, Client>();
function keyGen(length: number) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
}
// Automatically track clients

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");
  let generatedRoomKey = keyGen(10);
  ws.send(JSON.stringify({ req: "init", roomKey: generatedRoomKey }));
  activeClients.set(
    generatedRoomKey,
    new Client(generatedRoomKey, ws, undefined)
  );
  ws.on("close", () => {
    activeClients.delete(generatedRoomKey);
    console.log("Client Disconnected");
  });
});
function waitForNextMessage(ws: WebSocket): Promise<string> {
  return new Promise((resolve, reject) => {
    const handler = (data) => {
      ws.off("message", handler); // Remove handler after first message
      resolve(data.toString());
    };
    ws.once("message", handler);
    ws.once("error", reject);
    ws.once("close", () => reject(new Error("WebSocket closed")));
  });
}
//API the user wishes to send the requestes to
/** @type {import('express')} */
console.log("building API");

const express = require("express");
const cookieSession = require("cookie-session");
import { JwtPayload } from "jsonwebtoken";

const apiApp = express();
apiApp.use(
  cookieSession({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000,
  })
);
apiApp.use(express.json());

apiApp.post("/login", (req, res) => {
  // Authenticate user here...
  console.log("recieved client login :" + req.body["roomKey"]);
  if (!req.body["roomKey"]) {
    return res.status(400).json({ error: "Missing Room Key" });
  }
  let attempt = activeClients.get(req.body["roomKey"]);
  if (attempt !== undefined && attempt.jwt === undefined) {
    console.log("found client:" + attempt.webSocket);
    const token = jwt.sign(
      { roomKey: req.body["roomKey"] },
      process.env.JWT_SECRET || "jwt-secret",
      {
        expiresIn: "1d",
      }
    );
    attempt.jwt = token;
    if (!req.session) {
      req.session = {};
    }
    req.session.jwt = token; // Store JWT in session cookie
    res.json({ message: "Logged in" });
    return res;
  }
  return res.status(401).json({ error: "Not authenticated" });
});

apiApp.get("/actions", async (req, res): Promise<any> => {
  if (!req.session || !req.session.jwt)
    return res.status(401).json({ error: "Not authenticated" });
  const token = req.session.jwt;

  try {
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET || "jwt-secret"
    ) as JwtPayload;
    let activeBackend = activeClients.get(user.roomKey);
    if (activeBackend == undefined || activeBackend.webSocket == undefined) {
      res.session.jwt = undefined;
      return res.status(400).json({ error: "backend client no longer exists" });
    } else {
      activeBackend.webSocket?.send(JSON.stringify({ req: "actions" }));
      try {
        const message = await waitForNextMessage(activeBackend.webSocket);
        return res.json({ message });
      } catch (err) {
        return res.status(500).json({ error: "Failed to receive message" });
      }
    }
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

apiApp.get("/play/:action", async (req, res): Promise<any> => {
  if (!req.session || !req.session.jwt)
    return res.status(401).json({ error: "Not authenticated" });
  const token = req.session.jwt;

  try {
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET || "jwt-secret"
    ) as JwtPayload;
    let activeBackend = activeClients.get(user.roomKey);
    if (activeBackend == undefined || activeBackend.webSocket == undefined) {
      res.session.jwt = undefined;
      return res.status(400).json({ error: "backend client no longer exists" });
    } else {
      if (req.params.action == undefined) {
        return res.status(400).json({ error: "action to play not included" });
      }
      activeBackend.webSocket?.send(
        JSON.stringify({ req: "play", action: req.params.action })
      );
      try {
        const message = await waitForNextMessage(activeBackend.webSocket);
        return res.json({ message });
      } catch (err) {
        return res.status(500).json({ error: "Failed to receive message" });
      }
    }
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

const PORT = process.env.PORT || 3000;
apiApp.listen(PORT, () => {
  console.log(`Express API listening on http://localhost:${PORT}`);
  console.log("listening reached");
});
console.log("finished loading everything");
