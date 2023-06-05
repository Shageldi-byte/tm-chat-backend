"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIO = void 0;
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./src/routes/router"));
const socket_io_1 = require("socket.io");
const constant_1 = require("./src/core/constant");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use('/public', express_1.default.static('public'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ limit: "500mb", extended: true, parameterLimit: 500000 }));
app.use('/api', router_1.default);
const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at ${port}`);
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*'
    }
});
io.on(constant_1.SOCKET_EVENTS.connection, (client) => {
    console.log("Connected  " + client.id);
    client.on(constant_1.SOCKET_EVENTS.onNewMessage, (data) => {
        console.log(constant_1.SOCKET_EVENTS.onNewMessage, data);
        io.emit(constant_1.SOCKET_EVENTS.onNewMessage, data);
    });
    client.on(constant_1.SOCKET_EVENTS.onChatRoomCreated, (data) => {
        io.emit(constant_1.SOCKET_EVENTS.onChatRoomCreated, data);
    });
    client.on(constant_1.SOCKET_EVENTS.onMarkAsRead, (data) => {
        io.emit(constant_1.SOCKET_EVENTS.onMarkAsRead, data);
    });
    client.on(constant_1.SOCKET_EVENTS.disconnect, () => {
        console.log(constant_1.SOCKET_EVENTS.disconnect);
    });
});
exports.SocketIO = io;
