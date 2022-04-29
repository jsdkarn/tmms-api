import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document, Types } from 'mongoose';

export type LogDocument = Log & Document;

@Schema()
export class Log {
  @Prop({ required: true })
  action: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tool' })
  tool_id: Types.ObjectId;

  @Prop({ required: true })
  qty: number;

  @Prop()
  desc?: string;

  @Prop({ required: true })
  created_at: Date;

  @Prop({ required: true })
  action_by: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
