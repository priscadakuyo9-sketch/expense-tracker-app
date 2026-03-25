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
exports.BudgetsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const budget_schema_1 = require("../schemas/budget.schema");
const expense_schema_1 = require("../schemas/expense.schema");
let BudgetsService = class BudgetsService {
    budgetModel;
    expenseModel;
    constructor(budgetModel, expenseModel) {
        this.budgetModel = budgetModel;
        this.expenseModel = expenseModel;
    }
    async createOrUpdate(createBudgetDto, userId) {
        const query = {
            userId: new mongoose_2.Types.ObjectId(userId),
            period: createBudgetDto.period,
        };
        if (createBudgetDto.categoryId) {
            query.categoryId = new mongoose_2.Types.ObjectId(createBudgetDto.categoryId);
        }
        const updateData = {
            ...createBudgetDto,
            userId: new mongoose_2.Types.ObjectId(userId),
        };
        const value = createBudgetDto.limitAmount || createBudgetDto.amount || 0;
        updateData.amount = value;
        updateData.limitAmount = value;
        if (createBudgetDto.categoryId) {
            updateData.categoryId = new mongoose_2.Types.ObjectId(createBudgetDto.categoryId);
        }
        const budget = await this.budgetModel
            .findOneAndUpdate(query, { $set: updateData }, { new: true, upsert: true })
            .exec();
        return budget;
    }
    async findCurrent(userId) {
        return this.budgetModel
            .findOne({ userId: new mongoose_2.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .exec();
    }
    async findByPeriod(userId, period) {
        return this.budgetModel
            .findOne({ userId: new mongoose_2.Types.ObjectId(userId), period })
            .exec();
    }
    async getBudgetStatus(userId) {
        const now = new Date();
        const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const budget = await this.findByPeriod(userId, period);
        if (!budget) {
            return { hasBudget: false };
        }
        const startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999));
        const expenses = await this.expenseModel.find({
            userId: new mongoose_2.Types.ObjectId(userId),
            date: { $gte: startDate, $lte: endDate },
        }).exec();
        const totalSpent = expenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);
        const limitAmount = budget.limitAmount ?? budget.amount ?? 0;
        const alertThreshold = budget.alertThreshold ?? 80;
        const percentage = limitAmount > 0 ? Math.round((totalSpent / limitAmount) * 100) : 0;
        const alertTriggered = percentage >= alertThreshold;
        return {
            hasBudget: true,
            period,
            limitAmount,
            totalSpent,
            percentage,
            alertThreshold,
            alertTriggered,
        };
    }
};
exports.BudgetsService = BudgetsService;
exports.BudgetsService = BudgetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(budget_schema_1.Budget.name)),
    __param(1, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], BudgetsService);
//# sourceMappingURL=budgets.service.js.map