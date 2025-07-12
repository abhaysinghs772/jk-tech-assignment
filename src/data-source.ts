// data-source.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables
dotenv.config();

const dbType = process.env.DB_TYPE || 'postgres';

export const AppDataSource = new DataSource({
  type: dbType as 'postgres',
  host: process.env[`${dbType.toUpperCase()}_HOST`] || 'localhost',
  port: parseInt(
    process.env[`${dbType.toUpperCase()}_PORT`] ||
      (dbType === 'mysql' ? '3306' : '5432'),
  ),
  username: process.env[`${dbType.toUpperCase()}_USERNAME`] || 'root',
  password: process.env[`${dbType.toUpperCase()}_PASSWORD`] || 'password',
  database: process.env[`${dbType.toUpperCase()}_DATABASE`] || 'test',
  entities: [join(__dirname, '/**/*.entity.{ts,.js}')],
  migrations: [join(__dirname, '/default/migrations/**/*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
  logging: true,
});
