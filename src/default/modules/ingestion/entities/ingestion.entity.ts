import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { DocumentEntity } from '../../documents/entities/document.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { IngestionStatus } from '../../../common/enums/ingestion.enum';

@Entity('ingestion_processes')
export class IngestionProcessEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DocumentEntity, (document) => document.ingestionProcesses, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  document: DocumentEntity | null;

  @ManyToOne(() => UserEntity, (user) => user.triggeredIngestions, { nullable: false })
  triggeredBy: UserEntity;

  @Column({
    type: 'enum',
    enum: IngestionStatus,
    default: IngestionStatus.PENDING,
  })
  status: IngestionStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  startedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  logs: string | null;
}
