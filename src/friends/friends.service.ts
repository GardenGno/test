import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Friendship, FriendshipStatus } from './friendship.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friendship) private readonly friendshipRepository: Repository<Friendship>,
    private readonly usersService: UsersService,
  ) {}

  async requestFriend(requesterId: string, addresseeId: string): Promise<Friendship> {
    if (requesterId === addresseeId) {
      throw new BadRequestException('Cannot add yourself');
    }
    const requester = await this.usersService.findById(requesterId);
    const addressee = await this.usersService.findById(addresseeId);

    const existing = await this.friendshipRepository.findOne({
      where: [{ requester: { id: requesterId }, addressee: { id: addresseeId } }],
    });
    if (existing) {
      return existing;
    }

    const friendship = this.friendshipRepository.create({ requester, addressee });
    return this.friendshipRepository.save(friendship);
  }

  async acceptRequest(requestId: string, addresseeId: string): Promise<Friendship> {
    const friendship = await this.friendshipRepository.findOne({
      where: { id: requestId },
      relations: ['addressee', 'requester'],
    });
    if (!friendship) {
      throw new NotFoundException('Request not found');
    }
    if (friendship.addressee.id !== addresseeId) {
      throw new BadRequestException('Not allowed to accept this request');
    }
    friendship.status = FriendshipStatus.Accepted;
    return this.friendshipRepository.save(friendship);
  }

  async listFriends(userId: string): Promise<Friendship[]> {
    return this.friendshipRepository.find({
      where: [
        { requester: { id: userId }, status: FriendshipStatus.Accepted },
        { addressee: { id: userId }, status: FriendshipStatus.Accepted },
      ],
      relations: ['requester', 'addressee'],
    });
  }
}
