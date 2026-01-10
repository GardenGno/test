import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CatsService } from './cats.service';
import { CatProfile, CreateCatDto, UpdateCatDto } from './cats.types';

@Controller('cats')
@UseGuards(AuthGuard, RolesGuard)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @Roles('admin', 'trainer')
  findAll(): CatProfile[] {
    return this.catsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'trainer')
  findOne(@Param('id') id: string): CatProfile {
    return this.catsService.findOne(id);
  }

  @Post()
  @Roles('admin')
  create(@Body() body: CreateCatDto): CatProfile {
    return this.catsService.create(body);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCatDto,
  ): CatProfile {
    return this.catsService.update(id, body);
  }
}
