import { SERVER_URL } from "../core/constant";

export const addUserQuery = `
INSERT INTO public.users(
 firstname, lastname, username, password, phone_number, email, image, uuid, usertype, description, front_id, sell_point_uuid)
 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;
`;

export const checkUsernameQuery = `
SELECT * FROM public.users WHERE username=$1 AND is_deleted=false ORDER BY created_at DESC LIMIT 1;
`;

export const checkPhoneNumberQuery = `
SELECT * FROM public.users WHERE phone_number=$1 AND is_deleted=false;
`;


export const updateUserQuery = `
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
export const addLogQuery = `
INSERT INTO public.user_logs(
	user_id, endpoint, full_url, req_params, req_query, req_headers, req_body, req_ip, req_files)
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;
`;

export const updateUserAvatarQuery = `
UPDATE public.users
	SET  image=$1, updated_at='now()'
	WHERE id = $2 RETURNING image;
`;

export const addStoreQuery = `
INSERT INTO public.sell_point(
	name, address, phone_number, slug)
	VALUES ($1, $2, $3, $4) RETURNING *;
`;

export const findAllShopsQuery = `
SELECT * FROM public.sell_point ORDER BY created_at DESC;
`;

export const deleteShopQuery = `
DELETE FROM public.sell_point
	WHERE id=$1;
`;

export const getModeratorsQuery = `
    SELECT * FROM public.users WHERE usertype = 'MODERATOR' AND is_deleted=false ORDER BY created_at DESC;
`;

export const getModeratorsByShopQuery = `
    SELECT * FROM public.users WHERE sell_point_uuid = $1 AND usertype = 'MODERATOR' AND is_deleted=false ORDER BY created_at DESC;
`;

export const getAdminUsers = `
    SELECT * FROM public.users WHERE usertype = 'ADMIN' AND is_deleted=false ORDER BY created_at DESC;
`;

export const checkByUUID = `
SELECT * FROM public.users WHERE uuid=$1 AND is_deleted=false;
`;

export const updateUserDataQuery = `
UPDATE public.users
	SET firstname=$1, lastname=$2, username=$3, password=$4, phone_number=$5, email=$6, image=$7, uuid=$8, description=$9, is_deleted=false, front_id=$10
	WHERE uuid = $8 RETURNING *;
`;

export const createChatRoomQuery = `
INSERT INTO public.chat_room(
	title, image, user_id, shop_slug, uuid)
	VALUES ($1,$2,$3,$4,$5) RETURNING *;
`;

export const addMessageQuery = `
INSERT INTO public.chat(
	user_id, mime_type, message, front_path, to_id, reply_id, click_url, message_size, message_duration, status,uuid,chat_room_uuid)
	VALUES ($1, $2, $3,$4, $5,$6, $7, $8, $9, $10,$11,$12) RETURNING *;
`;

export const addMultipleMessageQuery = `
INSERT INTO public.chat(
	user_id, mime_type, message, front_path, to_id, reply_id, click_url, message_size, message_duration, status,uuid,chat_room_uuid)
	VALUES %L RETURNING *;
`;

export const addUserToRoomQuery = `
INSERT INTO public.user_permission(
	user_id,  room_uuid)
	VALUES %L;
`;

export const addSingleUserToRoomQuery = `
INSERT INTO public.user_permission(
	user_id,  room_uuid)
	VALUES ($1,$2) RETURNING *;
`;

export const markAsReadQuery = `
UPDATE public.chat
	SET updated_at='now()', status='seen'
	WHERE chat_room_uuid=$1 AND user_id!=$2 RETURNING uuid;
`;

export const getChatRoomUsersQuery = `
SELECT DISTINCT user_id
	FROM user_permission WHERE room_uuid=$1 AND is_leave=false;
`;

export const getUserChatRoomsQuery = `
SELECT r.*, 
(SELECT array_to_json(array_agg(u.*)) FROM users u WHERE u.id IN (SELECT up.user_id FROM public.user_permission up WHERE up.room_uuid=r.uuid AND up.is_leave=false)) AS users
FROM public.chat_room r WHERE r.is_used=true AND r.uuid IN (SELECT up.room_uuid FROM public.user_permission up WHERE up.user_id=$1 AND up.is_leave=false) ORDER BY r.created_at DESC;
`;

export const getUserChatRoomsModeratorQuery = `
SELECT r.*, 
(SELECT array_to_json(array_agg(u.*)) FROM users u WHERE u.id IN (SELECT up.user_id FROM public.user_permission up WHERE up.room_uuid=r.uuid AND up.is_leave=false)) AS users
FROM public.chat_room r WHERE r.uuid IN (SELECT up.room_uuid FROM public.user_permission up WHERE up.user_id=$1 AND up.is_leave=false) ORDER BY r.created_at DESC;
`;

export const getChatRoomDetailsQuery = `
SELECT r.*, 
(SELECT array_to_json(array_agg(u.*)) FROM users u WHERE u.id IN (SELECT up.user_id FROM public.user_permission up WHERE up.room_uuid=r.uuid AND up.is_leave=false)) AS users
FROM public.chat_room r WHERE r.uuid=$1 ORDER BY r.created_at DESC;
`;

export const updateRoomUsedQuery = `
UPDATE public.chat_room
	SET is_used=false
	WHERE uuid IN (SELECT room_uuid FROM public.user_permission WHERE user_id=$1);
`;

export const getOldMessagesQuery = `
SELECT c.*, u.username,u.image AS avatar, 
(SELECT array_agg(us.id) FROM users us WHERE us.id IN (SELECT up.user_id FROM public.user_permission up WHERE up.room_uuid=$1)) AS users
FROM public.chat c 
LEFT JOIN users u ON u.id=c.user_id
WHERE c.chat_room_uuid = $1
ORDER BY created_at;
`;

export const leaveChatRoomQuery = `
DELETE FROM public.user_permission
	WHERE room_uuid=$1 AND user_id=$2;
`;

export const removeChatHistoryQuery = `
DELETE FROM chat WHERE (created_at, created_at) OVERLAPS ($1::DATE, $2::DATE)
`;

export const removeChatRoomQuery = `
DELETE FROM public.chat_room
	WHERE (created_at, created_at) OVERLAPS ($1::DATE, $2::DATE);
`;