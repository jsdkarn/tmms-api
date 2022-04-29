import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  Patch,
  Delete,
} from '@nestjs/common';
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { Response } from 'express';
import { UpdateToolDto } from './dto/update-tool.dto';

@Controller('tools')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Post()
  async create(@Body() createToolDto: CreateToolDto, @Res() res: Response) {
    try {
      const toolType: string[] = ['tool', 'material'];
      if (toolType.includes(createToolDto.tool_type)) {
        createToolDto.created_at = new Date();
        var newTool = await this.toolService.create(createToolDto);
        res.status(HttpStatus.CREATED).json({
          status: true,
          data: newTool,
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          status: false,
          msg: "tool type only is 'tool' or 'material'",
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

  @Get()
  async findAll(@Res() res: Response) {
    try {
      var tools = await this.toolService.findAll();
      res.status(HttpStatus.CREATED).json({
        status: true,
        data: tools,
      });
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
      var tool = await this.toolService.findOne(id);
      res.status(HttpStatus.CREATED).json({
        status: true,
        data: tool,
      });
    } catch (e) {
      console.log(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        errors: e.message,
      });
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolService.update(id, updateToolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toolService.remove(+id);
  }
}
