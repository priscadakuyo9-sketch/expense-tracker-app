import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/budget.dto';
export declare class BudgetsController {
    private readonly budgetsService;
    constructor(budgetsService: BudgetsService);
    createOrUpdate(createBudgetDto: CreateBudgetDto, req: any): Promise<import("../schemas/budget.schema").Budget>;
    findCurrent(req: any): Promise<import("../schemas/budget.schema").Budget | null>;
    findByPeriod(req: any, period: string): Promise<import("../schemas/budget.schema").Budget | null>;
}
