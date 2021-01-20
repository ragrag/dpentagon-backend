import { Exclude } from 'class-transformer';
import { IsPhoneNumber, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Catalogue } from './catalogue.entity';
import { Post } from './post.entity';
import { Profession } from './profession.entity';

@Entity('user')
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id',
  })
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ default: false })
  emailConfirmed: boolean;

  @Column({ nullable: false, select: false })
  // @Exclude()
  password: string;

  @Column({ type: 'enum', enum: ['company', 'freelancer'], nullable: false })
  userType: string;

  @Index()
  @ManyToOne(() => Profession, profession => profession.users, { eager: true })
  profession: Profession;

  @Index()
  @Column({ nullable: false })
  country: string;

  @Index()
  @Column({ nullable: false })
  displayName: string;

  @Column({ nullable: true, default: '' })
  profileInfo: string;

  @Column({ nullable: true })
  socialProvider: string;

  @Column({ nullable: true })
  socialProviderId: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  coverPhoto: string;

  // @OneToMany(() => Post, post => post.user)
  // posts: Post[];

  @OneToMany(() => Catalogue, catalogue => catalogue.user)
  catalogues: Catalogue[];

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

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
