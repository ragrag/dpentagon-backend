import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity('profession')
export class Profession extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id',
  })
  id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Post, post => post.profession)
  posts: Post[];

  @OneToMany(() => Post, user => user.profession)
  users: Post[];
}
