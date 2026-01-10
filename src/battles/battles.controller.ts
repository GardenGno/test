import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard, AuthUser } from '../common/auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { BattleRequest, BattleResult, BattlesService } from './battles.service';

@Controller('battles')
@UseGuards(AuthGuard, RolesGuard)
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}

  @Post()
  @Roles('trainer', 'admin')
  battle(@Body() body: BattleRequest, @Req() req: Request): BattleResult {
    const user = req.user as AuthUser;
    return this.battlesService.resolveBattle(body, user.username);
  }
}
