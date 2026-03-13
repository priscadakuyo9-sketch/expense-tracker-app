import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private categoriesService;
    constructor(usersService: UsersService, jwtService: JwtService, categoriesService: CategoriesService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            currency: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            currency: any;
        };
    }>;
}
