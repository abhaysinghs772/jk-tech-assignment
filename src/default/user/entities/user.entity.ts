import { Exclude } from 'class-transformer';
import { UserRoles } from '../../common/enums/role.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { DocumentEntity } from '../../documents/entities/document.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, default: null })
  mobile: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ nullable: true, name: 'last_login_at', type: 'timestamp' })
  lastLoginAt: Date;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.Viewer,
    nullable: true,
  })
  roles: UserRoles;

  @Column({ nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @Column({ nullable: true })
  otp: string;

  @OneToMany(() => DocumentEntity, (doc) => doc.uploaded_by, { cascade: true })
  documents: DocumentEntity[];

  @Column({ nullable: true, name: 'refresh_token_expiry', type: 'timestamp' })
  refreshTokenExpiry: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt?: Date;
}
