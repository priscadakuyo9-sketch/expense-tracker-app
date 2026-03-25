export declare class CreateExpenseDto {
    amount: number;
    description: string;
    date?: string;
    categoryId: string;
    paymentMethod: string;
}
export declare class UpdateExpenseDto {
    amount?: number;
    description?: string;
    date?: string;
    categoryId?: string;
    paymentMethod?: string;
}
