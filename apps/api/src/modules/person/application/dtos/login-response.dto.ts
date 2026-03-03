/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from "class-validator";

export class LoginResponseDto {
  @IsString()
  @IsOptional()
  accessToken?: string;

  constructor(partial?: Partial<LoginResponseDto>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}