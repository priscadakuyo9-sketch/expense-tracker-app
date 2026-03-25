import { Model } from 'mongoose';
import { Expense } from '../schemas/expense.schema';
export declare class StatsService {
    private expenseModel;
    constructor(expenseModel: Model<Expense>);
    getMonthlyStats(userId: string, year: number, month: number): Promise<any[]>;
    getYearlyTrend(userId: string, year: number): Promise<any[]>;
}
