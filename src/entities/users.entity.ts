import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  profileInfo: string;

  @Column({ nullable: true })
  socialProvider: string;

  @Column({ nullable: true })
  socialProviderId: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true, default: false })
  verified: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(type => User, user => user.following)
  @JoinTable()
  followers: User[];

  @ManyToMany(type => User, user => user.followers)
  following: User[];

  followersCount: number;

  followingCount: number;
}
