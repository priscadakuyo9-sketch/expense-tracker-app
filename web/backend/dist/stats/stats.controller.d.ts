import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    getMonthlyStats(req: any, year: string, month: string): Promise<any[]>;
    getYearlyTrend(req: any, year: string): Promise<{
        _id: {
            month: number;
        };
        totalAmount: number;
    }[]>;
}
