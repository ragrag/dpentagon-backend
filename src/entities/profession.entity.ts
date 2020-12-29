import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity('Profession')
export class Profession extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Post, post => post.profession)
  posts: Post[];

  @OneToMany(() => Post, user => user.profession)
  users: Post[];
}
