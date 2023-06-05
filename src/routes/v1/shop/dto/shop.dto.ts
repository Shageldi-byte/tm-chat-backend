import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export default class ShopDto{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    address: string;

    @IsPhoneNumber('TM')
    phone_number: string;

    @IsString()
    @IsNotEmpty()
    slug: string;
}