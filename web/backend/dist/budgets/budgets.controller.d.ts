import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/budget.dto';
export declare class BudgetsController {
    private readonly budgetsService;
    constructor(budgetsService: BudgetsService);
    createOrUpdate(createBudgetDto: CreateBudgetDto, req: any): Promise<import("../schemas/budget.schema").Budget>;
    findCurrent(req: any): Promise<import("../schemas/budget.schema").Budget | null>;
    getBudgetStatus(req: any): Promise<{
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
    findByPeriod(req: any, period: string): Promise<import("../schemas/budget.schema").Budget | null>;
}
