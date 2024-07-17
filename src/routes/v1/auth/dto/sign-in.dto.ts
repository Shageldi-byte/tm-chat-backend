import { IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";

export class SignInDto{
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}