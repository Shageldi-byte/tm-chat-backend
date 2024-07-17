import {IsNotEmpty, IsPhoneNumber} from "class-validator";

export class CheckPhoneDto{
    @IsPhoneNumber('TM')
    @IsNotEmpty()
    phone_number: string;
}