import { IsNumber, IsString, IsNotEmpty, IsOptional, IsDateString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseDto {
    @ApiProperty({ example: 1500, description: 'Amount of the expense' })
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty({ example: 'Grocery shopping', description: 'Description of the expense' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: '2024-03-20T10:00:00Z', description: 'Date of the expense' })
    @IsDateString()
    @IsOptional()
    date?: string;

    @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1', description: 'ID of the category' })
    @IsMongoId()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({ example: 'Mobile Money', description: 'Payment method used' })
    @IsString()
    @IsNotEmpty()
    paymentMethod: string;
}

export class UpdateExpenseDto {
    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    amount?: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    date?: string;

    @ApiProperty({ required: false })
    @IsMongoId()
    @IsOptional()
    categoryId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    paymentMethod?: string;
}
