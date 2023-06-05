export default class SendMessageDto {
    users: string[];
    message: string;
    mime_type: string;
    user_id: number;
    front_path: string;
    to_id: number;
    reply_id: number;
    click_url: string;
    message_size: string;
    message_duration: string;
    status: string;
    uuid: string;
    chat_room_uuid: string;
    username: string;
    avatar: string;
    created_at: Date;
}