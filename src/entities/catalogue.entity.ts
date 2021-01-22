import { BaseEntity, Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Post } from './post.entity';
import { Profession } from './profession.entity';
import { User } from './users.entity';

@Entity('catalogue')
export class Catalogue extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id',
  })
  id: number;

  @ManyToOne(() => User, user => user.catalogues, { eager: true, nullable: false, onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Post, post => post.catalogue)
  posts: Post[];

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  photo: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
