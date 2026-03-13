import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from '../schemas/category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) { }

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: string,
  ): Promise<Category> {
    const createdCategory = new this.categoryModel({
      ...createCategoryDto,
      userId: new Types.ObjectId(userId),
    });
    return createdCategory.save();
  }

  async findAll(userId: string): Promise<Category[]> {
    return this.categoryModel
      .find({ userId: new Types.ObjectId(userId) })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Category> {
    const category = await this.categoryModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    userId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const existingCategory = await this.categoryModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        { $set: updateCategoryDto },
        { new: true },
      )
      .exec();
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return existingCategory;
  }

  async seedDefaultCategories(userId: string): Promise<void> {
    const defaults = [
      { name: 'Food', type: 'EXPENSE', icon: '🍔' },
      { name: 'Transport', type: 'EXPENSE', icon: '🚗' },
      { name: 'Rent', type: 'EXPENSE', icon: '🏠' },
      { name: 'Salary', type: 'INCOME', icon: '💰' },
      { name: 'Entertainment', type: 'EXPENSE', icon: '🎮' },
    ];

    const currentCategories = await this.findAll(userId);
    if (currentCategories.length === 0) {
      const docs = defaults.map((d) => ({
        ...d,
        userId: new Types.ObjectId(userId),
      }));
      await this.categoryModel.insertMany(docs);
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.categoryModel
      .deleteOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
