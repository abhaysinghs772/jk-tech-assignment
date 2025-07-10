import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('idempotency_keys')
export class IdempotencyKeyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  idempotencyKey: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'json', nullable: true }) // Use 'json' instead of 'jsonb'
  response: any;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
