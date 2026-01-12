import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FriendRequestDto } from './dto';
import { FriendsService } from './friends.service';
import { Friendship } from './friendship.entity';

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('request')
  @ApiOkResponse({ type: Friendship })
  async requestFriend(
    @CurrentUser() user: { userId: string },
    @Body() dto: FriendRequestDto,
  ): Promise<Friendship> {
    return this.friendsService.requestFriend(user.userId, dto.addresseeId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('accept/:id')
  @ApiOkResponse({ type: Friendship })
  async accept(@CurrentUser() user: { userId: string }, @Param('id') id: string): Promise<Friendship> {
    return this.friendsService.acceptRequest(id, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOkResponse({ type: [Friendship] })
  async list(@CurrentUser() user: { userId: string }): Promise<Friendship[]> {
    return this.friendsService.listFriends(user.userId);
  }
}
