import DeleteChatHistoryDto from "./dto/delete-chat-history.dto";
import InviteChatRoomDto from "./dto/invite-chat-room.dto";
import MarkAsReadDto from "./dto/mark-as-read.dto";
import SendMessageDto from "./dto/send-message.dto";
import express from "express";
import { makeValidateBody } from "../../../validation";
import { hashPassword } from "../auth/auth.service";
import { authenticateToken, checkIsAdmin } from "../auth/jwt.service";
import { deleteChatByDate, getChatRoomDetails, getChatRoomMessages, initChat, inviteChatRoom, leaveChatRoom, markAsRead, sendImageMessage, sendMessage, uploadChatImage } from "./chat.service";
import { InitChatDto } from "./dto/init-chat.dto";

const chatController = express.Router();

chatController.post('/init-chat', makeValidateBody(InitChatDto,false), hashPassword, initChat);
chatController.post('/send-message', sendMessage);
chatController.post('/send-image', uploadChatImage.single('image'),sendImageMessage);
chatController.post('/mark-as-read',makeValidateBody(MarkAsReadDto,false),markAsRead);
chatController.get('/get-chat-room-messages/:chatRoom', getChatRoomMessages);
chatController.post('/leave-chat-room/:userId/:roomId',leaveChatRoom);
chatController.post('/delete-chat-history',authenticateToken,checkIsAdmin, makeValidateBody(DeleteChatHistoryDto,false),deleteChatByDate);
chatController.get('/get-chat-room-details/:roomId',getChatRoomDetails);
chatController.post('/invite-chat-room', makeValidateBody(InviteChatRoomDto,false),inviteChatRoom);
export default chatController;