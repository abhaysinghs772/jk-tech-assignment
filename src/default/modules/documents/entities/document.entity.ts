import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { IngestionProcessEntity } from '../../ingestion/entities/ingestion.entity';

@Entity('documents')
export class DocumentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  path: string;

  @ManyToOne(() => UserEntity, (user) => user.documents, { nullable: true })
  uploaded_by: UserEntity;

  @OneToMany(() => IngestionProcessEntity, (ingestion) => ingestion.document)
  ingestionProcesses: IngestionProcessEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: Date;
}
