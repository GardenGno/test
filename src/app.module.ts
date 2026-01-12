import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GiftsModule } from './gifts/gifts.module';
import { FriendsModule } from './friends/friends.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { Gift } from './gifts/gift.entity';
import { Friendship } from './friends/friendship.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: Number(config.get<string>('DATABASE_PORT')),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        entities: [User, Gift, Friendship],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    GiftsModule,
    FriendsModule,
  ],
})
export class AppModule {}
