import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense } from '../schemas/expense.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
  ) {}

  async getMonthlyStats(userId: string, year: number, month: number) {
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)); // exclusive: first day of next month

    // Use find for better reliability across environments
    const expenses = await this.expenseModel.find({
      userId: new Types.ObjectId(userId),
      date: { $gte: startDate, $lt: endDate },
    }).populate('categoryId').exec();

    // Group by category manually for consistency
    const statsMap = new Map();
    expenses.forEach((exp: any) => {
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

  async getYearlyTrend(userId: string, year: number) {
    const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0)); // exclusive: first day of next year

    const expenses = await this.expenseModel.find({
      userId: new Types.ObjectId(userId),
      date: { $gte: startDate, $lt: endDate },
    }).exec();

    const monthlyStats = Array(12).fill(0).map((_, i) => ({
      _id: { month: i + 1 },
      totalAmount: 0,
    }));

    expenses.forEach((exp: any) => {
      const month = exp.date.getUTCMonth();
      monthlyStats[month].totalAmount += Number(exp.amount) || 0;
    });

    return monthlyStats.sort((a, b) => a._id.month - b._id.month);
  }
}
