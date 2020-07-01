import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

export default abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @CreateDateColumn({ name: 'dateCreated', nullable: false })
  public dateCreated!: Date;

  @UpdateDateColumn({ name: 'lastUpdated', nullable: false })
  public lastUpdated!: Date;
}
