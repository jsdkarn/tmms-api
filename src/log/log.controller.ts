import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { LogService } from './log.service';
import { CreateLogDto } from './dto/create-log.dto';
import { Response } from 'express';
import { ToolService } from 'src/tool/tool.service';
import mongoose from 'mongoose';

@Controller('logs')
export class LogController {
  constructor(
    private readonly logService: LogService,
    private readonly toolService: ToolService,
  ) {}

  @Post()
  async create(@Body() createLogDto: CreateLogDto, @Res() res: Response) {
    try {
      var systemAction: string[] = ['add', 'withdraw'];
      createLogDto.created_at = new Date();
      var tool = await this.toolService.findOne(createLogDto.tool_id);
      if (
        tool.tool_type == 'material' &&
        !systemAction.includes(createLogDto.action)
      ) {
        res.status(HttpStatus.BAD_REQUEST).json({
          status: false,
          errors: `action only is 'add' or 'withdraw'`,
        });
      } else {
        var currentQty = await this.logService.findSummaryQtyByTool(
          createLogDto.tool_id,
        );
        if (
          createLogDto.action == 'withdraw' &&
          createLogDto.qty > currentQty
        ) {
          res.status(HttpStatus.BAD_REQUEST).json({
            status: false,
            errors: `current qty exceeded, must less than ${currentQty}.`,
          });
        } else {
          var newTool = await this.logService.create(createLogDto);
          res.status(HttpStatus.CREATED).json({
            status: true,
            data: newTool,
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        errors: e.message,
      });
    }
  }

  @Get()
  async findAll(@Query('tool_id') tool_id: string, @Res() res: Response) {
    try {
      if (tool_id) {
        var logs = await this.logService.findByTool(tool_id);
        res.status(HttpStatus.OK).json({
          status: true,
          data: logs,
        });
      } else {
        var logs = await this.logService.findAll();
        res.status(HttpStatus.OK).json({
          status: true,
          data: logs,
        });
      }
    } catch (e) {
      console.log(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        errors: e.message,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      var log = await this.logService.findOne(id);
      res.status(HttpStatus.OK).json({
        status: true,
        data: log,
      });
    } catch (e) {
      console.log(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        errors: e.message,
      });
    }
  }
  @Get('/return/:id')
  async returnTool(@Param('id') id: string, @Res() res: Response) {
    try {
      var log = await this.logService.findOne(id);
      var thistool = await this.toolService.findOne(log.tool_id.toString());
      if (thistool.tool_type == 'material') {
        res.status(HttpStatus.BAD_REQUEST).json({
          status: false,
          errors: `tool type 'material' can't change action.`,
        });
      } else if (log.action != 'withdraw') {
        res.status(HttpStatus.BAD_REQUEST).json({
          status: false,
          errors: `can change action only 'withdraw'.`,
        });
      } else {
        await this.logService.updateAction(id);
        res.status(HttpStatus.OK).json({
          status: true,
          msg: `update action success.`,
        });
      }
    } catch (e) {
      console.log(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        errors: e.message,
      });
    }
  }

  @Get('/summary/:toolId')
  async getToolSummary(@Param('toolId') toolId: string, @Res() res: Response) {
    try {
      var tool = await this.toolService.findOne(toolId);
      var summaryQty = await this.logService.findSummaryQtyByTool(toolId);
      var logs = await this.logService.findByTool(toolId);
      res.status(HttpStatus.OK).json({
        status: true,
        data: {
          ...tool['_doc'],
          summaryQty: summaryQty,
          logs: logs,
        },
        date: new Date(),
      });
    } catch (e) {
      console.log(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        errors: e.message,
      });
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLogDto: UpdateLogDto) {
  //   return this.logService.update(+id, updateLogDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.logService.remove(+id);
  // }
}
