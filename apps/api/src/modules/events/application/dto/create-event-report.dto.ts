import { IsNotEmpty, IsString } from "class-validator";

export class CreateEventReportDto {
    @IsString()
    @IsNotEmpty()
    reason: string;
}