import { Exclude } from 'class-transformer';
import { UserRoles } from '../../common/enums/role.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class UserEntity {
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

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.Viewer, nullable: true })
  roles: UserRoles;

  @Column({ nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true, name: 'refresh_token_expiry', type: 'timestamp' })
  refreshTokenExpiry: Date;
}
