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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_schema_1 = require("../schemas/category.schema");
let CategoriesService = class CategoriesService {
    categoryModel;
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }
    async create(createCategoryDto, userId) {
        const createdCategory = new this.categoryModel({
            ...createCategoryDto,
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        return createdCategory.save();
    }
    async findAll(userId) {
        return this.categoryModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .exec();
    }
    async findOne(id, userId) {
        const category = await this.categoryModel
            .findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            userId: new mongoose_2.Types.ObjectId(userId),
        })
            .exec();
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async update(id, userId, updateCategoryDto) {
        const existingCategory = await this.categoryModel
            .findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), userId: new mongoose_2.Types.ObjectId(userId) }, { $set: updateCategoryDto }, { new: true })
            .exec();
        if (!existingCategory) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return existingCategory;
    }
    async seedDefaultCategories(userId) {
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
                userId: new mongoose_2.Types.ObjectId(userId),
            }));
            await this.categoryModel.insertMany(docs);
        }
    }
    async remove(id, userId) {
        const result = await this.categoryModel
            .deleteOne({
            _id: new mongoose_2.Types.ObjectId(id),
            userId: new mongoose_2.Types.ObjectId(userId),
        })
            .exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map