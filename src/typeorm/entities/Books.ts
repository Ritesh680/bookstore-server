import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  price: string;

  @Column()
  description: string;

  @Column()
  genre: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ default: new Date() })
  created_at: Date;
}
