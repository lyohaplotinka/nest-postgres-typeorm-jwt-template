import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique(['email'])
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public email: string;

  @Column()
  public password: string;
}
