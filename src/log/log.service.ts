import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateLogDto } from './dto/create-log.dto';
import { Log, LogDocument } from './log.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}
  async create(createLogDto: CreateLogDto): Promise<Log> {
    const createdCat = new this.logModel(createLogDto);
    return createdCat.save();
  }

  async findAll(): Promise<Log[]> {
    return this.logModel.find().exec();
  }

  async findOne(id: string): Promise<Log> {
    return this.logModel.findById(id).exec();
  }

  async findByTool(toolId: string): Promise<Log[]> {
    return this.logModel.find({ tool_id: toolId }).exec();
  }

  async findSummaryQtyByTool(toolId: string): Promise<number> {
    const ObjectId = mongoose.Types.ObjectId;
    var logDBSummary = await this.logModel.aggregate([
      { $match: { tool_id: new ObjectId(toolId) } },
      {
        $group: {
          _id: '$action',
          totalQty: { $sum: '$qty' },
        },
      },
      {
        $project: {
          _id: 0,
          action: '$_id',
          qty: '$totalQty',
        },
      },
    ]);

    const sumWithInitial = logDBSummary.reduce((previousValue, currentObj) => {
      if (currentObj.action == 'add') {
        return previousValue + currentObj.qty;
      } else if (currentObj.action == 'withdraw') {
        return previousValue - currentObj.qty;
      } else if (currentObj.action == 'return') {
        return previousValue + 0;
      }
    }, 0);
    return sumWithInitial;
  }
  async updateAction(id: string) {
    let doc = await this.logModel.findOneAndUpdate(
      { _id: id },
      { action: 'return' },
    );
    return doc;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} log`;
  // }
}
