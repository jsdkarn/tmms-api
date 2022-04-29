import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ToolDocument = Tool & Document;

@Schema()
export class Tool {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  tool_type: string;

  @Prop({ required: true })
  work_type: string;

  @Prop()
  desc?: string;

  @Prop({ required: true })
  unit: string;

  @Prop({ required: true })
  created_at: Date;

  @Prop({ required: true })
  created_by: string;
}

export const ToolSchema = SchemaFactory.createForClass(Tool);
