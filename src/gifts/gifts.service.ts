import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gift } from './gift.entity';
import { User } from '../users/user.entity';

@Injectable()
export class GiftsService {
  constructor(@InjectRepository(Gift) private readonly giftRepository: Repository<Gift>) {}

  async createGift(owner: User, data: Partial<Gift>): Promise<Gift> {
    const gift = this.giftRepository.create({ ...data, owner });
    return this.giftRepository.save(gift);
  }

  async listForOwner(ownerId: string): Promise<Gift[]> {
    return this.giftRepository.find({ where: { owner: { id: ownerId } } });
  }

  async getGift(id: string): Promise<Gift> {
    const gift = await this.giftRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!gift) {
      throw new NotFoundException('Gift not found');
    }
    return gift;
  }

  async removeGift(id: string): Promise<void> {
    await this.giftRepository.delete(id);
  }
}
