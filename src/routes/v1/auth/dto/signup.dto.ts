import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export type UserType = 'USER'| 'ADMIN' | 'MODERATOR' | 'VIP_USER' | 'SHOP_WORKER';

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    lastname: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;


    @IsPhoneNumber("TM")
    phone_number: string="+99360000000";

    @IsEmail()
    email: string;

    image: string="";

    uuid: string="";

    usertype: UserType='USER';

    description: string='';

    front_id: string='-1';

    sell_point_uuid: string='-1';
}