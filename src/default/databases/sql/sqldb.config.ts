import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

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
    synchronize: false,
    migrationsRun: false,
    logging: configService.get<boolean>('ENABLE_CONSOLE_LOG', true),
    logger: 'advanced-console',
  };

  return config;
};
