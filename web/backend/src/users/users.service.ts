import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: any): Promise<User> {
    console.log('[USERS] Create appelé pour:', createUserDto.email);
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    console.log('[USERS] Hash bcrypt généré ✅');
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const saved = await createdUser.save();
    console.log('[USERS] Utilisateur sauvegardé en DB ✅, ID:', saved._id);
    return saved;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}
