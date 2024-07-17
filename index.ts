import connection from "./src/database/connection";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import router from "./src/routes/router";
import { Server } from "socket.io";
import { SOCKET_EVENTS } from "./src/core/constant";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({limit: "500mb", extended: true, parameterLimit:500000}));
app.use('/api',router);


const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at ${port}`);
});

const io = new Server(server,{
  cors: {
    origin: '*'
  }
});
io.on(SOCKET_EVENTS.connection, (client) => {
    console.log("Connected  "+client.id);
    client.on(SOCKET_EVENTS.onNewMessage, (data: any)=> {
        console.log(SOCKET_EVENTS.onNewMessage,data);
        io.emit(SOCKET_EVENTS.onNewMessage, data);
    });
    client.on(SOCKET_EVENTS.onChatRoomCreated,(data: any)=>{
      io.emit(SOCKET_EVENTS.onChatRoomCreated,data);
    })
    client.on(SOCKET_EVENTS.onMarkAsRead,(data: any)=>{
      io.emit(SOCKET_EVENTS.onMarkAsRead,data);
    })
    client.on(SOCKET_EVENTS.disconnect, ()=> {
      console.log(SOCKET_EVENTS.disconnect);
    })
});

export const SocketIO = io;