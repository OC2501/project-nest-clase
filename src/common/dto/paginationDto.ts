import { IsNumber, IsOptional, IsPositive, Min } from "class-validator"

export class PaginationDto{
    @IsNumber()
    @IsPositive()
    @IsOptional()
    page: number

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Min(1)
    limit: number 
}