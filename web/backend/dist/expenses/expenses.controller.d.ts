import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    create(createExpenseDto: CreateExpenseDto, req: any): Promise<import("../schemas/expense.schema").Expense>;
    findAll(req: any, categoryId?: string, startDate?: string, endDate?: string): Promise<import("../schemas/expense.schema").Expense[]>;
    findOne(id: string, req: any): Promise<import("../schemas/expense.schema").Expense>;
    update(id: string, updateExpenseDto: UpdateExpenseDto, req: any): Promise<import("../schemas/expense.schema").Expense>;
    remove(id: string, req: any): Promise<void>;
}
