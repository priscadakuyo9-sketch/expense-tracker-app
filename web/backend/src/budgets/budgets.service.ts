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
    console.log(`[BUDGET] CreateOrUpdate for user ${userId}, period ${createBudgetDto.period}, category ${createBudgetDto.categoryId || 'null'}`);
    console.log(`[BUDGET] Amount: ${createBudgetDto.amount}, Limit: ${createBudgetDto.limitAmount}`);

    const query: any = {
      userId: new Types.ObjectId(userId),
      period: createBudgetDto.period,
      categoryId: createBudgetDto.categoryId ? new Types.ObjectId(createBudgetDto.categoryId) : null,
    };

    const value = Number(createBudgetDto.limitAmount) || Number(createBudgetDto.amount) || 0;
    const updateData: any = {
      ...createBudgetDto,
      userId: new Types.ObjectId(userId),
      amount: value,
      limitAmount: value,
      alertThreshold: Number(createBudgetDto.alertThreshold) || 80,
    };

    if (createBudgetDto.categoryId) {
      updateData.categoryId = new Types.ObjectId(createBudgetDto.categoryId);
    } else {
      updateData.categoryId = null; // Ensure it's explicitly null for global budgets
    }

    const budget = await this.budgetModel
      .findOneAndUpdate(query, { $set: updateData }, { new: true, upsert: true })
      .exec();

    console.log(`[BUDGET] Saved result:`, {
      id: budget?._id,
      amount: (budget as any).amount,
      limit: (budget as any).limitAmount,
      period: budget?.period
    });

    return budget as Budget;
  }

  async findCurrent(userId: string): Promise<Budget | null> {
    return this.budgetModel
      .findOne({ 
        userId: new Types.ObjectId(userId), 
        $or: [
          { categoryId: null },
          { categoryId: "" as any },
          { categoryId: { $exists: false } }
        ]
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByPeriod(userId: string, period: string): Promise<Budget | null> {
    return this.budgetModel
      .findOne({ 
        userId: new Types.ObjectId(userId), 
        period, 
        $or: [
          { categoryId: null },
          { categoryId: "" as any },
          { categoryId: { $exists: false } }
        ]
      })
      .exec();
  }

  async getBudgetStatus(userId: string) {
    // Use UTC methods consistently so the server timezone never matters
    const now = new Date();
    const utcYear = now.getUTCFullYear();
    const utcMonth = now.getUTCMonth(); // 0-indexed
    const period = `${utcYear}-${String(utcMonth + 1).padStart(2, '0')}`;

    // 1. Try exact YYYY-MM match
    // 2. Fall back to legacy 'MONTHLY' period
    // 3. Fall back to the most recent budget for this user
    let budget = await this.findByPeriod(userId, period);
    if (!budget) {
      budget = await this.findByPeriod(userId, 'MONTHLY');
    }
    if (!budget) {
      budget = await this.findCurrent(userId);
    }
    if (!budget) {
      return { hasBudget: false, totalSpent: 0, percentage: 0 };
    }

    // Date range: first day of current month 00:00 UTC  →  first day of NEXT month 00:00 UTC (exclusive)
    const startDate = new Date(Date.UTC(utcYear, utcMonth, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(utcYear, utcMonth + 1, 1, 0, 0, 0, 0)); // exclusive

    // Query all expenses in this month for this user
    const expenses = await this.expenseModel.find({
      userId: new Types.ObjectId(userId),
      date: { $gte: startDate, $lt: endDate },
    }).exec();

    // Safely sum amounts — cast each value through Number() to avoid string concatenation
    const totalSpent = expenses.reduce((acc, exp) => {
      const amt = Number(exp.amount) || 0;
      return acc + amt;
    }, 0);

    // Support both `limitAmount` (schema field) and `amount` (DTO field saved by legacy code)
    const limitAmount = Number((budget as any).limitAmount) || Number((budget as any).amount) || 0;
    const alertThreshold = Number((budget as any).alertThreshold) || 80;
    const percentage = limitAmount > 0 ? Math.round((totalSpent / limitAmount) * 100) : 0;

    return {
      hasBudget: true,
      period,
      limitAmount,
      amount: limitAmount, // Consistency for all clients
      totalSpent,
      percentage,
      alertThreshold,
      alertTriggered: percentage >= alertThreshold,
    };
  }
}
