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
let BudgetsService = class BudgetsService {
    budgetModel;
    constructor(budgetModel) {
        this.budgetModel = budgetModel;
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
};
exports.BudgetsService = BudgetsService;
exports.BudgetsService = BudgetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(budget_schema_1.Budget.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BudgetsService);
//# sourceMappingURL=budgets.service.js.map