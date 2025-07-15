import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const sqlDbConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dbType = configService.get<string>('DB_TYPE', 'postgres');

  const config: TypeOrmModuleOptions = {
    type: dbType as 'mysql' | 'postgres',
    host: configService.get<string>(
      `${dbType.toUpperCase()}_HOST`,
      'localhost',
    ),
    port: configService.get<number>(
      `${dbType.toUpperCase()}_PORT`,
      dbType === 'mysql' ? 3306 : 5432,
    ),
    username: configService.get<string>(
      `${dbType.toUpperCase()}_USERNAME`,
      'root',
    ),
    password: configService.get<string>(
      `${dbType.toUpperCase()}_PASSWORD`,
      'password',
    ),
    database: configService.get<string>(
      `${dbType.toUpperCase()}_DATABASE`,
      'test',
    ),
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    migrations: [
      join(__dirname, '/../../', 'database/migrations/**/*{.ts,.js}'),
    ],
    synchronize: false,
    migrationsTableName: 'typeorm_migrations',
    migrationsRun: false,
    logging: configService.get<boolean>('ENABLE_CONSOLE_LOG', true),
    logger: 'advanced-console',
  };

  return config;
};
