import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CategoryType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
}

export class CreateCategoryDto {
    @ApiProperty({ example: 'Food' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: CategoryType, example: CategoryType.EXPENSE })
    @IsEnum(CategoryType)
    @IsNotEmpty()
    type: string;

    @ApiProperty({ example: '🍔' })
    @IsString()
    @IsOptional()
    icon?: string;
}

export class UpdateCategoryDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ enum: CategoryType, required: false })
    @IsEnum(CategoryType)
    @IsOptional()
    type?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    icon?: string;
}
