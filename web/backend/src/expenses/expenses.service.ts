import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense } from '../schemas/expense.schema';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';

interface ExpenseFilters {
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
  ) { }

  async create(
    createExpenseDto: CreateExpenseDto,
    userId: string,
  ): Promise<Expense> {
    const createdExpense = new this.expenseModel({
      ...createExpenseDto,
      userId: new Types.ObjectId(userId),
      categoryId: new Types.ObjectId(createExpenseDto.categoryId),
    });
    return createdExpense.save();
  }

  async findAll(userId: string, filters: ExpenseFilters): Promise<Expense[]> {
    const query: any = { userId: new Types.ObjectId(userId) };
    if (filters.categoryId) {
      query.categoryId = new Types.ObjectId(filters.categoryId);
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

  async findOne(id: string, userId: string): Promise<Expense> {
    const expense = await this.expenseModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .populate('categoryId')
      .exec();
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async update(
    id: string,
    userId: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const updateData = { ...updateExpenseDto };
    if (updateExpenseDto.categoryId) {
      (updateData as any).categoryId = new Types.ObjectId(
        updateExpenseDto.categoryId,
      );
    }

    const updatedExpense = await this.expenseModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        { $set: updateData },
        { returnDocument: 'after' as any },
      )
      .populate('categoryId')
      .exec();

    if (!updatedExpense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return updatedExpense;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.expenseModel
      .deleteOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
  }
}
