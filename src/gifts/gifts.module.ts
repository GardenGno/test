import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Gift } from './gift.entity';
import { GiftsController } from './gifts.controller';
import { GiftsService } from './gifts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gift]), UsersModule],
  providers: [GiftsService],
  controllers: [GiftsController],
})
export class GiftsModule {}
