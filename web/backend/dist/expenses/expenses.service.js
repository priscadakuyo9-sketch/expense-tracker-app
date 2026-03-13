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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const expense_schema_1 = require("../schemas/expense.schema");
let ExpensesService = class ExpensesService {
    expenseModel;
    constructor(expenseModel) {
        this.expenseModel = expenseModel;
    }
    async create(createExpenseDto, userId) {
        const createdExpense = new this.expenseModel({
            ...createExpenseDto,
            userId: new mongoose_2.Types.ObjectId(userId),
            categoryId: new mongoose_2.Types.ObjectId(createExpenseDto.categoryId),
        });
        return createdExpense.save();
    }
    async findAll(userId, filters) {
        const query = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (filters.categoryId) {
            query.categoryId = new mongoose_2.Types.ObjectId(filters.categoryId);
        }
        if (filters.startDate && filters.endDate) {
            query.date = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate),
            };
        }
        return this.expenseModel
            .find(query)
            .populate('categoryId')
            .sort({ date: -1 })
            .exec();
    }
    async findOne(id, userId) {
        const expense = await this.expenseModel
            .findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            userId: new mongoose_2.Types.ObjectId(userId),
        })
            .populate('categoryId')
            .exec();
        if (!expense) {
            throw new common_1.NotFoundException(`Expense with ID ${id} not found`);
        }
        return expense;
    }
    async update(id, userId, updateExpenseDto) {
        const updateData = { ...updateExpenseDto };
        if (updateExpenseDto.categoryId) {
            updateData.categoryId = new mongoose_2.Types.ObjectId(updateExpenseDto.categoryId);
        }
        const updatedExpense = await this.expenseModel
            .findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), userId: new mongoose_2.Types.ObjectId(userId) }, { $set: updateData }, { new: true })
            .populate('categoryId')
            .exec();
        if (!updatedExpense) {
            throw new common_1.NotFoundException(`Expense with ID ${id} not found`);
        }
        return updatedExpense;
    }
    async remove(id, userId) {
        const result = await this.expenseModel
            .deleteOne({
            _id: new mongoose_2.Types.ObjectId(id),
            userId: new mongoose_2.Types.ObjectId(userId),
        })
            .exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Expense with ID ${id} not found`);
        }
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map