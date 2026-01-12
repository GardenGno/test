import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gift } from '../gifts/gift.entity';
import { Friendship } from '../friends/friendship.entity';
import { UserRole } from '../common/roles.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role!: UserRole;

  @OneToMany(() => Gift, (gift) => gift.owner)
  gifts!: Gift[];

  @OneToMany(() => Friendship, (friendship) => friendship.requester)
  sentFriendRequests!: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.addressee)
  receivedFriendRequests!: Friendship[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
