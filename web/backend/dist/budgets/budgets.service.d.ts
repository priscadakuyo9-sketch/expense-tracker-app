import { Model } from 'mongoose';
import { Budget } from '../schemas/budget.schema';
import { Expense } from '../schemas/expense.schema';
import { CreateBudgetDto } from './dto/budget.dto';
export declare class BudgetsService {
    private budgetModel;
    private expenseModel;
    constructor(budgetModel: Model<Budget>, expenseModel: Model<Expense>);
    createOrUpdate(createBudgetDto: CreateBudgetDto, userId: string): Promise<Budget>;
    findCurrent(userId: string): Promise<Budget | null>;
    findByPeriod(userId: string, period: string): Promise<Budget | null>;
    getBudgetStatus(userId: string): Promise<{
        hasBudget: boolean;
        period?: undefined;
        limitAmount?: undefined;
        totalSpent?: undefined;
        percentage?: undefined;
        alertThreshold?: undefined;
        alertTriggered?: undefined;
    } | {
        hasBudget: boolean;
        period: string;
        limitAmount: any;
        totalSpent: number;
        percentage: number;
        alertThreshold: any;
        alertTriggered: boolean;
    }>;
}
