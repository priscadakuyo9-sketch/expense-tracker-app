export declare enum CategoryType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE"
}
export declare class CreateCategoryDto {
    name: string;
    type: string;
    icon?: string;
}
export declare class UpdateCategoryDto {
    name?: string;
    type?: string;
    icon?: string;
}
