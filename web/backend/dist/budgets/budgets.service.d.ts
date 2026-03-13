import { Model } from 'mongoose';
import { Budget } from '../schemas/budget.schema';
import { CreateBudgetDto } from './dto/budget.dto';
export declare class BudgetsService {
    private budgetModel;
    constructor(budgetModel: Model<Budget>);
    createOrUpdate(createBudgetDto: CreateBudgetDto, userId: string): Promise<Budget>;
    findCurrent(userId: string): Promise<Budget | null>;
    findByPeriod(userId: string, period: string): Promise<Budget | null>;
}
