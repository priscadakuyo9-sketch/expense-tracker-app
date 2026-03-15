import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private categoriesService: CategoriesService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    console.log('[AUTH] validateUser appelé pour:', email);
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      console.log('[AUTH] Mot de passe validé ✅');
      const { password, ...result } = user.toObject();
      return result;
    }
    console.log('[AUTH] Mot de passe invalide ou utilisateur introuvable ❌');
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    console.log('[AUTH] Register appelé pour:', registerDto.email);
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) {
      console.log('[AUTH] Email déjà existant → ConflictException');
      throw new ConflictException('User already exists');
    }
    console.log('[AUTH] Nouvel utilisateur, création en cours...');
    const newUser = await this.usersService.create(registerDto);
    console.log('[AUTH] Utlisateur créé ✅, ID:', newUser._id.toString());
    await this.categoriesService.seedDefaultCategories(newUser._id.toString());
    console.log('[AUTH] Catégories seedées ✅');
    return this.login(newUser);
  }
}
