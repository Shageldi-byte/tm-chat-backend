"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_URL = exports.SOCKET_EVENTS = exports.SECRET_KEY = void 0;
exports.SECRET_KEY = 'fghasdf78b332g78gb3i2ug32';
exports.SOCKET_EVENTS = {
    connection: 'connection',
    onNewMessage: 'onNewMessage',
    disconnect: 'disconnect',
    onChatRoomCreated: 'onChatRoomCreated',
    onMarkAsRead: 'onMarkAsRead',
    onUserLeaveChatRoom: 'onUserLeaveChatRoom',
    onInviteChatRoom: 'onInviteChatRoom',
};
exports.SERVER_URL = 'http://localhost:5678';
