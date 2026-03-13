import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Budget } from '../schemas/budget.schema';
import { CreateBudgetDto } from './dto/budget.dto';

@Injectable()
export class BudgetsService {
  constructor(@InjectModel(Budget.name) private budgetModel: Model<Budget>) { }

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

    const updateData = {
      ...createBudgetDto,
      userId: new Types.ObjectId(userId),
    };

    if (createBudgetDto.categoryId) {
      updateData.categoryId = new Types.ObjectId(
        createBudgetDto.categoryId,
      ) as any;
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
}
