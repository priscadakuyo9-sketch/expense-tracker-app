import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Budget extends Document {
  @Prop({ required: true })
  limitAmount: number;

  @Prop({ required: true, default: 'MONTHLY' })
  period: string;

  @Prop({ default: 80 })
  alertThreshold: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
