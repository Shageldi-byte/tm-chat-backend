"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeChatRoomQuery = exports.removeChatHistoryQuery = exports.leaveChatRoomQuery = exports.getOldMessagesQuery = exports.updateRoomUsedQuery = exports.getChatRoomDetailsQuery = exports.getUserChatRoomsModeratorQuery = exports.getUserChatRoomsQuery = exports.getChatRoomUsersQuery = exports.markAsReadQuery = exports.addSingleUserToRoomQuery = exports.addUserToRoomQuery = exports.addMultipleMessageQuery = exports.addMessageQuery = exports.createChatRoomQuery = exports.updateUserDataQuery = exports.checkByUUID = exports.getAdminUsers = exports.getModeratorsByShopQuery = exports.getModeratorsQuery = exports.deleteShopQuery = exports.findAllShopsQuery = exports.addStoreQuery = exports.updateUserAvatarQuery = exports.addLogQuery = exports.updateUserQuery = exports.checkPhoneNumberQuery = exports.checkUsernameQuery = exports.addUserQuery = void 0;
exports.addUserQuery = `
INSERT INTO public.users(
 firstname, lastname, username, password, phone_number, email, image, uuid, usertype, description, front_id, sell_point_uuid)
 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;
`;
exports.checkUsernameQuery = `
SELECT * FROM public.users WHERE username=$1 AND is_deleted=false ORDER BY created_at DESC LIMIT 1;
`;
exports.checkPhoneNumberQuery = `
SELECT * FROM public.users WHERE phone_number=$1 AND is_deleted=false;
`;
exports.updateUserQuery = `
UPDATE public.users
	SET firstname=$1, 
    lastname=$2, 
    username=$3,
    password=$4, 
    phone_number=$5, 
    email=$6,
    updated_at='now()', 
    description=$7, 
    sell_point_uuid=$8, 
    front_id=$9
	WHERE uuid = $10 RETURNING *;
`;
exports.addLogQuery = `
INSERT INTO public.user_logs(
	user_id, endpoint, full_url, req_params, req_query, req_headers, req_body, req_ip, req_files)
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;
`;
exports.updateUserAvatarQuery = `
UPDATE public.users
	SET  image=$1, updated_at='now()'
	WHERE id = $2 RETURNING image;
`;
exports.addStoreQuery = `
INSERT INTO public.sell_point(
	name, address, phone_number, slug)
	VALUES ($1, $2, $3, $4) RETURNING *;
`;
exports.findAllShopsQuery = `
SELECT * FROM public.sell_point ORDER BY created_at DESC;
`;
exports.deleteShopQuery = `
DELETE FROM public.sell_point
	WHERE id=$1;
`;
exports.getModeratorsQuery = `
    SELECT * FROM public.users WHERE usertype = 'MODERATOR' AND is_deleted=false ORDER BY created_at DESC;
`;
exports.getModeratorsByShopQuery = `
    SELECT * FROM public.users WHERE sell_point_uuid = $1 AND usertype = 'MODERATOR' AND is_deleted=false ORDER BY created_at DESC;
`;
exports.getAdminUsers = `
    SELECT * FROM public.users WHERE usertype = 'ADMIN' AND is_deleted=false ORDER BY created_at DESC;
`;
exports.checkByUUID = `
SELECT * FROM public.users WHERE uuid=$1 AND is_deleted=false;
`;
exports.updateUserDataQuery = `
UPDATE public.users
	SET firstname=$1, lastname=$2, username=$3, password=$4, phone_number=$5, email=$6, image=$7, uuid=$8, description=$9, is_deleted=false, front_id=$10
	WHERE uuid = $8 RETURNING *;
`;
exports.createChatRoomQuery = `
INSERT INTO public.chat_room(
	title, image, user_id, shop_slug, uuid)
	VALUES ($1,$2,$3,$4,$5) RETURNING *;
`;
exports.addMessageQuery = `
INSERT INTO public.chat(
	user_id, mime_type, message, front_path, to_id, reply_id, click_url, message_size, message_duration, status,uuid,chat_room_uuid)
	VALUES ($1, $2, $3,$4, $5,$6, $7, $8, $9, $10,$11,$12) RETURNING *;
`;
exports.addMultipleMessageQuery = `
INSERT INTO public.chat(
	user_id, mime_type, message, front_path, to_id, reply_id, click_url, message_size, message_duration, status,uuid,chat_room_uuid)
	VALUES %L RETURNING *;
`;
exports.addUserToRoomQuery = `
INSERT INTO public.user_permission(
	user_id,  room_uuid)
	VALUES %L;
`;
exports.addSingleUserToRoomQuery = `
INSERT INTO public.user_permission(
	user_id,  room_uuid)
	VALUES ($1,$2) RETURNING *;
`;
exports.markAsReadQuery = `
UPDATE public.chat
	SET updated_at='now()', status='seen'
	WHERE chat_room_uuid=$1 AND user_id!=$2 RETURNING uuid;
`;
exports.getChatRoomUsersQuery = `
SELECT DISTINCT user_id
	FROM user_permission WHERE room_uuid=$1 AND is_leave=false;
`;
exports.getUserChatRoomsQuery = `
SELECT r.*, 
(SELECT array_to_json(array_agg(u.*)) FROM users u WHERE u.id IN (SELECT up.user_id FROM public.user_permission up WHERE up.room_uuid=r.uuid AND up.is_leave=false)) AS users
FROM public.chat_room r WHERE r.is_used=true AND r.uuid IN (SELECT up.room_uuid FROM public.user_permission up WHERE up.user_id=$1 AND up.is_leave=false) ORDER BY r.created_at DESC;
`;
exports.getUserChatRoomsModeratorQuery = `
SELECT r.*, 
(SELECT array_to_json(array_agg(u.*)) FROM users u WHERE u.id IN (SELECT up.user_id FROM public.user_permission up WHERE up.room_uuid=r.uuid AND up.is_leave=false)) AS users
FROM public.chat_room r WHERE r.uuid IN (SELECT up.room_uuid FROM public.user_permission up WHERE up.user_id=$1 AND up.is_leave=false) ORDER BY r.created_at DESC;
`;
exports.getChatRoomDetailsQuery = `
SELECT r.*, 
(SELECT array_to_json(array_agg(u.*)) FROM users u WHERE u.id IN (SELECT up.user_id FROM public.user_permission up WHERE up.room_uuid=r.uuid AND up.is_leave=false)) AS users
FROM public.chat_room r WHERE r.uuid=$1 ORDER BY r.created_at DESC;
`;
exports.updateRoomUsedQuery = `
UPDATE public.chat_room
	SET is_used=false
	WHERE uuid IN (SELECT room_uuid FROM public.user_permission WHERE user_id=$1);
`;
exports.getOldMessagesQuery = `
SELECT c.*, u.username,u.image AS avatar, 
(SELECT array_agg(us.id) FROM users us WHERE us.id IN (SELECT up.user_id FROM public.user_permission up WHERE up.room_uuid=$1)) AS users
FROM public.chat c 
LEFT JOIN users u ON u.id=c.user_id
WHERE c.chat_room_uuid = $1
ORDER BY created_at;
`;
exports.leaveChatRoomQuery = `
DELETE FROM public.user_permission
	WHERE room_uuid=$1 AND user_id=$2;
`;
exports.removeChatHistoryQuery = `
DELETE FROM chat WHERE (created_at, created_at) OVERLAPS ($1::DATE, $2::DATE)
`;
exports.removeChatRoomQuery = `
DELETE FROM public.chat_room
	WHERE (created_at, created_at) OVERLAPS ($1::DATE, $2::DATE);
`;
