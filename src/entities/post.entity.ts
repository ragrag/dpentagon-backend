import { BaseEntity, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Profession } from './profession.entity';
import { User } from './users.entity';

@Entity('post')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.posts, { eager: true, nullable: false })
  user: User;

  @ManyToOne(() => Profession, profession => profession.posts, { eager: true, nullable: false })
  profession: Profession;

  @Column({ nullable: false })
  url: string;

  @Column({ type: 'enum', enum: ['photo', 'video'] })
  postType: string;

  @Index()
  @Column()
  caption: string;

  @Column()
  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
