import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { CreateGiftDto, GiftResponseDto } from './dto';
import { GiftsService } from './gifts.service';

@ApiTags('gifts')
@Controller('gifts')
export class GiftsController {
  constructor(
    private readonly giftsService: GiftsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOkResponse({ type: GiftResponseDto })
  async create(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateGiftDto,
  ): Promise<GiftResponseDto> {
    const owner = await this.usersService.findById(user.userId);
    return this.giftsService.createGift(owner, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOkResponse({ type: [GiftResponseDto] })
  async listMine(@CurrentUser() user: { userId: string }): Promise<GiftResponseDto[]> {
    return this.giftsService.listForOwner(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOkResponse({ type: GiftResponseDto })
  async getGift(@Param('id') id: string): Promise<GiftResponseDto> {
    return this.giftsService.getGift(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async removeGift(@Param('id') id: string): Promise<void> {
    await this.giftsService.removeGift(id);
  }
}
