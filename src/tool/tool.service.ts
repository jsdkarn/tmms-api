import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateToolDto } from './dto/create-tool.dto';
import { Tool, ToolDocument } from './tool.schema';
import { Model } from 'mongoose';
import { UpdateToolDto } from './dto/update-tool.dto';

@Injectable()
export class ToolService {
  constructor(@InjectModel(Tool.name) private toolModel: Model<ToolDocument>) {}
  async create(createToolDto: CreateToolDto): Promise<Tool> {
    const createdCat = new this.toolModel(createToolDto);
    return createdCat.save();
  }

  async findAll(): Promise<Tool[]> {
    return this.toolModel.find().exec();
  }

  async findOne(id: string): Promise<Tool> {
    return this.toolModel.findById(id).exec();
  }

  async update(id: string, updateToolDto: UpdateToolDto): Promise<Tool> {
    return await this.toolModel.findByIdAndUpdate(id, updateToolDto, {
      new: true,
    });
  }

  async remove(id: number): Promise<any> {
    return await this.toolModel.findByIdAndRemove(id);
  }
}
