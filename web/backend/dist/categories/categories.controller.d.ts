import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto, req: any): Promise<import("../schemas/category.schema").Category>;
    findAll(req: any): Promise<import("../schemas/category.schema").Category[]>;
    findOne(id: string, req: any): Promise<import("../schemas/category.schema").Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto, req: any): Promise<import("../schemas/category.schema").Category>;
    remove(id: string, req: any): Promise<void>;
}
