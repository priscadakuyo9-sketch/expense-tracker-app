import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBudgetDto {
    @ApiProperty({ example: 50000, description: 'Monthly budget amount' })
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty({ example: '2024-03', description: 'Period in YYYY-MM format' })
    @IsString()
    @IsNotEmpty()
    period: string;

    @ApiProperty({ required: false, example: '65f1a2b3c4d5e6f7a8b9c0d1' })
    @IsString()
    @IsOptional()
    categoryId?: string;
}
