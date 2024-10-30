import { IsBoolean, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateCategoriaDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    description: string

    
}
