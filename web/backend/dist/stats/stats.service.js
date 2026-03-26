"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const expense_schema_1 = require("../schemas/expense.schema");
let StatsService = class StatsService {
    expenseModel;
    constructor(expenseModel) {
        this.expenseModel = expenseModel;
    }
    async getMonthlyStats(userId, year, month) {
        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
        const expenses = await this.expenseModel.find({
            userId: new mongoose_2.Types.ObjectId(userId),
            date: { $gte: startDate, $lt: endDate },
        }).populate('categoryId').exec();
        const statsMap = new Map();
        expenses.forEach((exp) => {
            const catId = exp.categoryId?._id?.toString() || 'unknown';
            if (!statsMap.has(catId)) {
                statsMap.set(catId, {
                    _id: exp.categoryId?._id,
                    totalAmount: 0,
                    count: 0,
                    categoryName: exp.categoryId?.name || 'Unknown',
                    categoryIcon: exp.categoryId?.icon || '💰',
                });
            }
            const stat = statsMap.get(catId);
            stat.totalAmount += Number(exp.amount) || 0;
            stat.count += 1;
        });
        return Array.from(statsMap.values());
    }
    async getYearlyTrend(userId, year) {
        const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
        const endDate = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0));
        const expenses = await this.expenseModel.find({
            userId: new mongoose_2.Types.ObjectId(userId),
            date: { $gte: startDate, $lt: endDate },
        }).exec();
        const monthlyStats = Array(12).fill(0).map((_, i) => ({
            _id: { month: i + 1 },
            totalAmount: 0,
        }));
        expenses.forEach((exp) => {
            const month = exp.date.getUTCMonth();
            monthlyStats[month].totalAmount += Number(exp.amount) || 0;
        });
        return monthlyStats.sort((a, b) => a._id.month - b._id.month);
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], StatsService);
//# sourceMappingURL=stats.service.js.map