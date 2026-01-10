import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { BattlesModule } from './battles/battles.module';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    CatsModule,
    BattlesModule,
  ],
})
export class AppModule {}
