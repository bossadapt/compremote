"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var ws_1 = require("ws");
var jwt = require("jsonwebtoken");
require("dotenv/config");
console.log("building Websocket");
//Websocket to user device they wish to send existing macros to
var wss = new ws_1.WebSocketServer({ port: 5876, path: "/remote/ws" });
// frontend server URL base
var Client = /** @class */ (function () {
    function Client(roomKey, webSocket, jwt) {
        this.jwt = undefined;
        this.roomKey = roomKey;
        this.webSocket = webSocket;
        this.jwt = jwt;
    }
    return Client;
}());
var activeClients = new Map();
function keyGen(length) {
    var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    var password = "";
    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
    }
    return password;
}
// Reciever connections
wss.on("connection", function (ws) {
    console.log("Client connected");
    var generatedRoomKey = keyGen(10);
    ws.send(JSON.stringify({ req: "init", roomKey: generatedRoomKey }));
    activeClients.set(generatedRoomKey, new Client(generatedRoomKey, ws, undefined));
    ws.on("close", function () {
        activeClients["delete"](generatedRoomKey);
        console.log("Client Disconnected");
    });
});
function waitForNextMessage(ws) {
    return new Promise(function (resolve, reject) {
        var handler = function (data) {
            ws.off("message", handler); // Remove handler after first message
            resolve(data.toString());
        };
        ws.once("message", handler);
        ws.once("error", reject);
        ws.once("close", function () { return reject(new Error("WebSocket closed")); });
    });
}
//Frontend connections
/** @type {import('express')} */
console.log("building API");
var express = require("express");
var cookieSession = require("cookie-session");
var cors = require("cors");
var apiApp = express();
apiApp.use(cookieSession({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000
}));
var allowedOrigins = ["http://localhost:5174", "https://bossadapt.org"];
apiApp.use(express.json());
apiApp.use(cors({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        else {
            return callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
apiApp.post("/login", function (req, res) {
    var _a;
    // Authenticate user here...
    console.log("recieved client login :" + req.body["roomKey"]);
    if (!req.body["roomKey"]) {
        console.log("User did not include roomkey when logging in");
        return res.status(401).json({ error: "Missing Room Key" });
    }
    var attempt = activeClients.get(req.body["roomKey"]);
    if (attempt !== undefined && attempt.jwt === undefined) {
        console.log("found client:" + attempt.webSocket);
        var token = jwt.sign({ roomKey: req.body["roomKey"] }, process.env.JWT_SECRET || "jwt-secret", {
            expiresIn: "1d"
        });
        attempt.jwt = token;
        if (!req.session) {
            req.session = {};
        }
        (_a = attempt.webSocket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({ req: "clientConnected" }));
        req.session.jwt = token; // Store JWT in session cookie
        res.json({ message: "Logged in" });
        return res;
    }
    console.log("User failed to entry valid room key to login");
    return res.status(401).json({ error: "Not authenticated" });
});
apiApp.get("/actions", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user, activeBackend, message, err_1, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.session || !req.session.jwt)
                    return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                token = req.session.jwt;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                user = jwt.verify(token, process.env.JWT_SECRET || "jwt-secret");
                activeBackend = activeClients.get(user.roomKey);
                if (!(activeBackend == undefined || activeBackend.webSocket == undefined)) return [3 /*break*/, 2];
                res.session.jwt = undefined;
                console.log("User attempted to access a closed backend connection");
                return [2 /*return*/, res.status(400).json({ error: "backend client no longer exists" })];
            case 2:
                (_a = activeBackend.webSocket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({ req: "actions" }));
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, waitForNextMessage(activeBackend.webSocket)];
            case 4:
                message = _b.sent();
                return [2 /*return*/, res.json({ message: message })];
            case 5:
                err_1 = _b.sent();
                console.log("Backend didn't respond to act ions");
                return [2 /*return*/, res.status(500).json({ error: "Failed to receive message" })];
            case 6: return [3 /*break*/, 8];
            case 7:
                err_2 = _b.sent();
                console.log("User attempted to get actions without a valid token");
                return [2 /*return*/, res.status(401).json({ error: "Invalid token" })];
            case 8: return [2 /*return*/];
        }
    });
}); });
apiApp.patch("/play/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user, activeBackend, action, message, err_3, err_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.session || !req.session.jwt)
                    return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                token = req.session.jwt;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                user = jwt.verify(token, process.env.JWT_SECRET || "jwt-secret");
                activeBackend = activeClients.get(user.roomKey);
                if (!(activeBackend == undefined || activeBackend.webSocket == undefined)) return [3 /*break*/, 2];
                res.session.jwt = undefined;
                console.log("User attempted to access a closed backend connection");
                return [2 /*return*/, res.status(401).json({ error: "backend client no longer exists" })];
            case 2:
                try {
                    action = req.body.action;
                    console.log("proxying action:", action);
                    if (action.name == undefined) {
                        console.log("User attempted to play without action included");
                        return [2 /*return*/, res.status(400).json({ error: "action to play not included" })];
                    }
                    if (action.variables == undefined) {
                        action.variables = [];
                    }
                    (_a = activeBackend.webSocket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({ req: "play", action: action }));
                }
                catch (err) {
                    return [2 /*return*/, res.status(400).json({ error: "error reading action request" })];
                }
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, waitForNextMessage(activeBackend.webSocket)];
            case 4:
                message = _b.sent();
                if (message != "failed to play") {
                    return [2 /*return*/, res.json({ message: message })];
                }
                else {
                    return [2 /*return*/, res
                            .status(500)
                            .json({ error: "backend failed to play requested file" })];
                }
                return [3 /*break*/, 6];
            case 5:
                err_3 = _b.sent();
                console.log("Backend didn't respond to play");
                return [2 /*return*/, res.status(500).json({ error: "Failed to receive message" })];
            case 6: return [3 /*break*/, 8];
            case 7:
                err_4 = _b.sent();
                console.log("User attempted to play action without a valid token");
                return [2 /*return*/, res.status(401).json({ error: "Invalid token" })];
            case 8: return [2 /*return*/];
        }
    });
}); });
var PORT = process.env.PORT || 3212;
apiApp.listen(PORT, function () {
    console.log("Express API listening on http://localhost:".concat(PORT));
    console.log("listening reached");
});
console.log("finished loading everything");
