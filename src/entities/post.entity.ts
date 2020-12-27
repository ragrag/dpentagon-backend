import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  content: string;

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

  @Column({ nullable: false })
  @Index()
  userId: number;
}
