import { IsDateString, IsNotEmpty } from "class-validator";
import { getCurrentDate } from "../../../../core/utils";

export default class DeleteChatHistoryDto {
    @IsDateString()
    @IsNotEmpty()
    start_date: Date;

    @IsDateString()
    end_date: Date = getCurrentDate();
}