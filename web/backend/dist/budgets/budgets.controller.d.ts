import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/budget.dto';
export declare class BudgetsController {
    private readonly budgetsService;
    constructor(budgetsService: BudgetsService);
    createOrUpdate(createBudgetDto: CreateBudgetDto, req: any): Promise<import("../schemas/budget.schema").Budget>;
    findCurrent(req: any): Promise<import("../schemas/budget.schema").Budget | null>;
    getBudgetStatus(req: any): Promise<{
        hasBudget: boolean;
        period?: undefined;
        limitAmount?: undefined;
        totalSpent?: undefined;
        percentage?: undefined;
        alertThreshold?: undefined;
        alertTriggered?: undefined;
        debug?: undefined;
    } | {
        hasBudget: boolean;
        period: string;
        limitAmount: any;
        totalSpent: number;
        percentage: number;
        alertThreshold: any;
        alertTriggered: boolean;
        debug: {
            userId: string;
            period: string;
        };
    }>;
    findByPeriod(req: any, period: string): Promise<import("../schemas/budget.schema").Budget | null>;
}
