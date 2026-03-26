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
        totalSpent: number;
        percentage: number;
        period?: undefined;
        limitAmount?: undefined;
        amount?: undefined;
        alertThreshold?: undefined;
        alertTriggered?: undefined;
    } | {
        hasBudget: boolean;
        period: string;
        limitAmount: number;
        amount: number;
        totalSpent: number;
        percentage: number;
        alertThreshold: number;
        alertTriggered: boolean;
    }>;
}
