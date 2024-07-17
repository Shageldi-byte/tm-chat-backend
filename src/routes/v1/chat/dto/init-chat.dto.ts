import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class InitChatDto{
    shop_slug: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    
    firstname: string;
    lastname:  string;

    @IsPhoneNumber('TM')
    phone_number: string;

    @IsEmail()
    email: string;
    image: string;
    uuid: string;
    description: string;
    front_id: string;

    @IsString()
    @IsNotEmpty()
    socket_id: string;
}