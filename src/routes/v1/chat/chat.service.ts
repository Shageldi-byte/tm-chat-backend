import DeleteChatHistoryDto from "./dto/delete-chat-history.dto";
import InviteChatRoomDto from "./dto/invite-chat-room.dto";
import MarkAsReadDto from "./dto/mark-as-read.dto";
import SendMessageDto from "./dto/send-message.dto";
import connection from "../../../database/connection";
import format from "pg-format";
import multer from "multer";
import { Request, Response } from "express";
import { SocketIO } from "../../../..";
import { badRequest, generateResponse } from "../../../core/app.response";
import { SERVER_URL, SOCKET_EVENTS } from "../../../core/constant";
import { generateUUID } from "../../../core/utils";
import { generateRandomAvatar } from "../../../core/utils";
import { InitChatDto } from "./dto/init-chat.dto";
import { MessageStatus, MimeType } from "./dto/types";

import {
  addMultipleMessageQuery,
  addSingleUserToRoomQuery,
  addUserToRoomQuery,
  getAdminUsers,
  getChatRoomDetailsQuery,
  getChatRoomUsersQuery,
  getModeratorsByShopQuery,
  getOldMessagesQuery,
  getUserChatRoomsModeratorQuery,
  getUserChatRoomsQuery,
  leaveChatRoomQuery,
  markAsReadQuery,
  removeChatHistoryQuery,
  removeChatRoomQuery,
  updateRoomUsedQuery,
} from "../../../database/query";

import {
  addMessageQuery,
  addUserQuery,
  checkByUUID,
  createChatRoomQuery,
  updateUserDataQuery,
} from "../../../database/query";

export async function initChat(
  req: Request<{}, {}, InitChatDto>,
  res: Response
) {
  let {
    description,
    email,
    firstname,
    front_id,
    image,
    lastname,
    password,
    phone_number,
    shop_slug,
    username,
    uuid,
    socket_id,
  } = req.body;

  let userId = -1;
  let toUsers = await connection.query(getAdminUsers);
  if (
    shop_slug &&
    typeof shop_slug !== "undefined" &&
    shop_slug !== null &&
    shop_slug.length > 0
  ) {
    toUsers = await connection.query(getModeratorsByShopQuery, [shop_slug]);
  }

  if (
    !image ||
    typeof image === "undefined" ||
    image === null ||
    image === ""
  ) {
    image = generateRandomAvatar(`${username} ${password}`);
  }

  let title = `${firstname} ${lastname}`;

  if (
    !title ||
    typeof title === "undefined" ||
    title == null ||
    title.length <= 0 ||
    typeof firstname === "undefined" ||
    typeof lastname === "undefined"
  ) {
    title = username;
  }

  if (uuid && typeof uuid !== "undefined" && uuid !== null && uuid.length > 0) {
    const oldData = await connection.query(checkByUUID, [uuid]);

    if (oldData.rows.length > 0) {
      const userUpdated = await connection.query(updateUserDataQuery, [
        firstname,
        lastname,
        username,
        password,
        phone_number,
        email,
        image,
        uuid,
        description,
        front_id,
      ]);
      if (userUpdated.rows.length <= 0) {
        badRequest({ res });
        return;
      }
      const user = userUpdated.rows[0];
      let roomUUID = socket_id;

      userId = user.id;

      await connection.query(updateRoomUsedQuery,[userId]);

      toUsers.rows.push(user);

      let chatRoomCreated: any = null;
      let isUser = user.user_type === 'USER';
      if(user.user_type === 'USER'){
        chatRoomCreated = await connection.query(createChatRoomQuery, [
        title,
        image,
        user.id,
        shop_slug,
        roomUUID,
      ]);
      }
      if ((chatRoomCreated && chatRoomCreated.rows.length > 0) || !isUser) {
        let sendMessage = { rows: [] };
        let message = new SendMessageDto();
        message.chat_room_uuid = roomUUID;
        message.click_url = "";
        message.front_path = "";
        message.message = `${title} joined chat`;
        message.message_duration = "";
        message.message_size = "0";
        message.mime_type = "plaintext/*";
        message.reply_id = 0;
        message.status = "pending";
        message.to_id = 0;
        message.user_id = userId;
        message.avatar = image;
        message.username = title;
        message.uuid = generateUUID();
        message.created_at = new Date();
        message.users = [...toUsers.rows.map((row) => row.id), userId];
        if(isUser){
          let cr = chatRoomCreated.rows[0];
          cr.users = toUsers.rows;
          SocketIO.emit(SOCKET_EVENTS.onChatRoomCreated, cr);
        }
        let oldRooms: any = [];

        if(user.usertype==='USER'){
          oldRooms = await connection.query(getUserChatRoomsQuery,[userId]);
        } else {
          oldRooms = await connection.query(getUserChatRoomsModeratorQuery,[userId]);
        }

        SocketIO.emit(SOCKET_EVENTS.onNewMessage, message);
        

        if (toUsers.rows.length > 0) {
          let values: any = [[userId, roomUUID]];
          toUsers.rows.forEach((row) => values.push([row.id, roomUUID]));
          await connection.query(format(addUserToRoomQuery, values));
        }
         sendMessage = await connection.query(addMessageQuery, [
              userId,
              "plaintext/*",
              `Ulanyjy ${title} çata baglandy!`,
              "",
              0,
              0,
              "",
              0,
              0,
              "pending",
              generateUUID(),
              roomUUID,
            ]);
        res.json(
          generateResponse({
            body: {
              user: user,
              chatRoom: chatRoomCreated?chatRoomCreated.rows[0]:{},
              oldRooms: oldRooms.rows,
              sendMessage: {
                message: "Siz çata baglandyňyz!",
              },
            },
          })
        );
      } else {
        badRequest({
          res,
          message: {
            en: "Chat room creation failed",
            tm: "Chat otagyny döredip bolmady",
          },
        });
      }
    }
  } else {
    uuid = generateUUID();
    const createdUser = await connection.query(addUserQuery, [
      firstname,
      lastname,
      username,
      password,
      phone_number,
      email,
      image,
      uuid,
      "USER",
      description,
      front_id,
      null,
    ]);
    if (createdUser && createdUser.rows.length > 0) {
      const user = createdUser.rows[0];
      let roomUUID = socket_id;
      userId = user.id;
      toUsers.rows.push(user);
      const chatRoomCreated = await connection.query(createChatRoomQuery, [
        title,
        image,
        user.id,
        shop_slug,
        roomUUID,
      ]);

      if (chatRoomCreated && chatRoomCreated.rows.length > 0) {
        let sendMessage = { rows: [] };
        if (toUsers.rows.length > 0) {
          let values: any = [[userId, roomUUID]];
          toUsers.rows.forEach((row) => values.push([row.id, roomUUID]));
          await connection.query(format(addUserToRoomQuery, values));
        }
        let message = new SendMessageDto();
        message.chat_room_uuid = roomUUID;
        message.click_url = "";
        message.front_path = "";
        message.message = `${title} joined chat`;
        message.message_duration = "";
        message.message_size = "0";
        message.mime_type = "plaintext/*";
        message.reply_id = 0;
        message.status = "pending";
        message.to_id = 0;
        message.user_id = userId;
        message.uuid = generateUUID();
        message.avatar = image;
        message.username = title;
        message.created_at = new Date();
        message.users = [...toUsers.rows.map((row) => row.id), userId];
        let cr = chatRoomCreated.rows[0];
        cr.users = toUsers.rows;

        const oldRooms = await connection.query(getUserChatRoomsQuery,[userId]);
        SocketIO.emit(SOCKET_EVENTS.onNewMessage, message);
        SocketIO.emit(SOCKET_EVENTS.onChatRoomCreated, cr);
         sendMessage = await connection.query(addMessageQuery, [
              userId,
              "plaintext/*",
              `Ulanyjy ${title} çata baglandy!`,
              "",
              0,
              0,
              "",
              0,
              0,
              "pending",
              generateUUID(),
              roomUUID,
            ]);
        res.json(
          generateResponse({
            body: {
              user: user,
              chatRoom: chatRoomCreated.rows[0],
              oldRooms: oldRooms.rows,
              sendMessage: {
                message: "Siz çata baglandyňyz!",
              },
            },
          })
        );
      } else {
        badRequest({
          res,
          message: {
            en: "Chat room creation failed",
            tm: "Chat otagyny döredip bolmady",
          },
        });
      }
    } else {
      badRequest({
        res: res,
        message: {
          en: "User could not be created",
          tm: "Ulanyjyny doredip bolmady",
        },
        code: 400,
      });
    }
  }
}

export async function sendMessage(
  req: Request<{}, {}, SendMessageDto>,
  res: Response
) {
  try {
    const {
      message,
      mime_type,
      user_id,
      front_path,
      to_id,
      reply_id,
      click_url,
      message_size,
      message_duration,
      status,
      chat_room_uuid,
      username,
      avatar,
    } = req.body;
    console.log('room',chat_room_uuid);
    let uuid = generateUUID();
    req.body.uuid = uuid;
    req.body.created_at = new Date();
    let users = await connection.query(getChatRoomUsersQuery, [chat_room_uuid]);
    
    let sendMessage = await connection.query(addMessageQuery, [
      user_id, mime_type, message, front_path, to_id, reply_id, click_url, message_size, message_duration, status,uuid,chat_room_uuid
    ]);
    req.body.users = users.rows.map((user) => user.user_id);
    SocketIO.emit(SOCKET_EVENTS.onNewMessage, req.body);
    res.json(
      generateResponse({
        body: sendMessage.rows[0],
      })
    );
  } catch (err) {
    throw err;
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

export const uploadChatImage = multer({ storage: storage });

export async function sendImageMessage(
  req: Request<{}, {}, SendMessageDto>,
  res: Response
) {
  let image = req.file?.path;

  console.log(image);

  const {
    user_id,
    front_path,
    to_id,
    reply_id,
    status,
    chat_room_uuid,
    username,
    avatar,
  } = req.body;
  let uuid = generateUUID();
  req.body.message = `${image}`;
  req.body.click_url = `${image}`;
  req.body.message_size = `${req.file?.size}`;
  req.body.uuid = uuid;
  req.body.created_at = new Date();
  console.log(chat_room_uuid);
  let users = await connection.query(getChatRoomUsersQuery, [chat_room_uuid]);

  
  let sendMessage = await connection.query(
    addMessageQuery, [
      user_id,
      "image/*",
      image,
      front_path,
      to_id,
      0,
      image,
      req.file?.size,
      0,
      "sent",
      uuid,
      chat_room_uuid,
    ]
  );
  req.body.users = users.rows.map((user) => user.user_id);
  SocketIO.emit(SOCKET_EVENTS.onNewMessage, req.body);
  res.json(
    generateResponse({
      body: sendMessage.rows[0],
    })
  );
}

export async function markAsRead(
  req: Request<{}, {}, MarkAsReadDto>,
  res: Response
) {
  const { roomId, userId } = req.body;
  const updated = await connection.query(markAsReadQuery, [roomId, userId]);
  let data = {
    ids: updated.rows,
    roomId,
    userId,
  };
  res.json(
    generateResponse({
      body: data,
    })
  );
  SocketIO.emit(SOCKET_EVENTS.onMarkAsRead, data);
}

export async function getChatRoomMessages(req:Request, res:Response){
  try{
    const chatRoomUUID = req.params.chatRoom;
    connection.query(getOldMessagesQuery,[chatRoomUUID])
    .then(result=>{
      res.json(generateResponse({
        body: result.rows
      }))
    })
    .catch(err=>{
      throw err;
    })
  } catch(err){
    throw err;
  }
}

export async function getChatHistory(req: Request, res: Response) {}

export async function leaveChatRoom(req: Request, res: Response) {
  const userId = req.params.userId;
  const roomId = req.params.roomId;
  await connection.query(leaveChatRoomQuery,[roomId,userId])
  .then(result=>{
    SocketIO.emit(SOCKET_EVENTS.onUserLeaveChatRoom, {roomId, userId});
    res.json(generateResponse({body:{userId,roomId}}));
  })
  .catch(err=>{
    badRequest({res});
  })
}

export async function deleteChatByDate(req: Request<{},{},DeleteChatHistoryDto>, res: Response) {
  const {
    start_date,
    end_date
  } = req.body;

  try{
    await connection.query(removeChatRoomQuery,[start_date,end_date]);
    await connection.query(removeChatHistoryQuery,[start_date,end_date])
    .then(response => {
      res.json(generateResponse({body: 'success'}));
    })
    .catch(err=>{
      badRequest({res});
    })
  }catch(err){
    badRequest({res});
  }
}

export async function inviteChatRoom(req:Request<{},{},InviteChatRoomDto>,res:Response){
  const {
    roomUUID,
    userId
  } = req.body;
  try{
    connection.query(addSingleUserToRoomQuery,[userId,roomUUID])
    .then(result=>{
      if(result.rows.length>0){
        res.json(generateResponse({body: result.rows[0]}));
        SocketIO.emit(SOCKET_EVENTS.onInviteChatRoom, {roomUUID, userId})
      } else {
        console.log('1')
        badRequest({res});
      }
    })
    .catch(err=>{
      console.log(err);
      badRequest({res});
    })
  } catch(err){
    badRequest({res});
  }
}

export async function getChatRoomDetails(req: Request, res: Response){
  const roomId = req.params.roomId;
  connection.query(getChatRoomDetailsQuery,[roomId])
  .then(result=>{
    res.json(result.rows[0]);
  })
  .catch(err=>{
    badRequest({res});
  })
}