import { IsString, IsOptional, IsDate } from "class-validator"

export class CreateUserDto {
    @IsString()    
    name: string;

    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    dob: string

    @IsOptional()
    photo_profile: string
}
