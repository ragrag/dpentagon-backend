import { BaseEntity, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Catalogue } from './catalogue.entity';
import { Profession } from './profession.entity';
import { User } from './users.entity';

@Entity('post')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => User, user => user.posts, { eager: true, nullable: false })
  // user: User;

  @ManyToOne(() => Profession, profession => profession.posts, { eager: true, nullable: false })
  profession: Profession;

  @Column({ nullable: false })
  url: string;

  @Column({ type: 'enum', enum: ['photo', 'video'] })
  postType: string;

  @Index()
  @Column({ nullable: true })
  caption: string;

  @ManyToOne(() => Catalogue, catalogue => catalogue.posts, { eager: true, nullable: false })
  catalogue: Catalogue;

  @Column()
  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
