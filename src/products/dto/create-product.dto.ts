import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    description: string;

    @IsNumber()
    @IsNotEmpty()
    stock: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsArray()
    photo: string[];

    @IsNumber()
    @IsNotEmpty()
    categoryId: number;

    
}
