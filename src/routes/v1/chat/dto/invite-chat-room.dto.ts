import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export default class InviteChatRoomDto {
    @IsString()
    @IsNotEmpty()
    roomUUID: string;

    @IsNotEmpty()
    @IsNumber()
    userId: number;
}