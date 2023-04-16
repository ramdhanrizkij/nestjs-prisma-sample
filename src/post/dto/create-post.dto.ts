import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
    @IsString()
    title:string

    @IsString()
    content:string

    @IsOptional()
    @IsBoolean()
    published?: boolean

    @IsNumber()
    authorId: number
}
