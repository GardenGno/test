import { Module } from '@nestjs/common';
import { CatsModule } from '../cats/cats.module';
import { BattlesController } from './battles.controller';
import { BattlesService } from './battles.service';

@Module({
  imports: [CatsModule],
  controllers: [BattlesController],
  providers: [BattlesService],
})
export class BattlesModule {}
