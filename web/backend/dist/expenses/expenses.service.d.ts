import { Model } from 'mongoose';
import { Expense } from '../schemas/expense.schema';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
interface ExpenseFilters {
    categoryId?: string;
    startDate?: string;
    endDate?: string;
}
export declare class ExpensesService {
    private expenseModel;
    constructor(expenseModel: Model<Expense>);
    create(createExpenseDto: CreateExpenseDto, userId: string): Promise<Expense>;
    findAll(userId: string, filters: ExpenseFilters): Promise<Expense[]>;
    findOne(id: string, userId: string): Promise<Expense>;
    update(id: string, userId: string, updateExpenseDto: UpdateExpenseDto): Promise<Expense>;
    remove(id: string, userId: string): Promise<void>;
}
export {};
