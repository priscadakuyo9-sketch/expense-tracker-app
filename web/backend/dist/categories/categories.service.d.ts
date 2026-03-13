import { Model } from 'mongoose';
import { Category } from '../schemas/category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoriesService {
    private categoryModel;
    constructor(categoryModel: Model<Category>);
    create(createCategoryDto: CreateCategoryDto, userId: string): Promise<Category>;
    findAll(userId: string): Promise<Category[]>;
    findOne(id: string, userId: string): Promise<Category>;
    update(id: string, userId: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    seedDefaultCategories(userId: string): Promise<void>;
    remove(id: string, userId: string): Promise<void>;
}
