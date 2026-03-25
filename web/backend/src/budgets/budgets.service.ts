import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Budget } from '../schemas/budget.schema';
import { Expense } from '../schemas/expense.schema';
import { CreateBudgetDto } from './dto/budget.dto';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
  ) { }

  async createOrUpdate(
    createBudgetDto: CreateBudgetDto,
    userId: string,
  ): Promise<Budget> {
    const query: any = {
      userId: new Types.ObjectId(userId),
      period: createBudgetDto.period,
    };

    if (createBudgetDto.categoryId) {
      query.categoryId = new Types.ObjectId(createBudgetDto.categoryId);
    }

    const updateData: any = {
      ...createBudgetDto,
      userId: new Types.ObjectId(userId),
    };

    // Synchronize amount and limitAmount to satisfy all clients
    const value = createBudgetDto.limitAmount || createBudgetDto.amount || 0;
    updateData.amount = value;
    updateData.limitAmount = value;

    if (createBudgetDto.categoryId) {
      updateData.categoryId = new Types.ObjectId(
        createBudgetDto.categoryId,
      );
    }

    const budget = await this.budgetModel
      .findOneAndUpdate(query, { $set: updateData }, { new: true, upsert: true })
      .exec();

    return budget as Budget;
  }

  async findCurrent(userId: string): Promise<Budget | null> {
    return this.budgetModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByPeriod(userId: string, period: string): Promise<Budget | null> {
    return this.budgetModel
      .findOne({ userId: new Types.ObjectId(userId), period })
      .exec();
  }

  async getBudgetStatus(userId: string) {
    // Current period: YYYY-MM
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const budget = await this.findByPeriod(userId, period);
    if (!budget) {
      return { hasBudget: false };
    }

    // Sum all expenses for the current calendar month (UTC)
    const startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999));

    // Match expenses using standard find for better reliability across environments
    const expenses = await this.expenseModel.find({
      userId: new Types.ObjectId(userId),
      date: { $gte: startDate, $lte: endDate },
    }).exec();

    const totalSpent = expenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);

    // Support both `limitAmount` (schema field) and `amount` (DTO field saved by legacy code)
    const limitAmount = (budget as any).limitAmount ?? (budget as any).amount ?? 0;
    const alertThreshold = (budget as any).alertThreshold ?? 80;
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
}

