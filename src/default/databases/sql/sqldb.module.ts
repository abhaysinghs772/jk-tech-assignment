import { Module, Global, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { sqlDbConfig } from './sqldb.config';
import { AppConfigService } from 'src/default/config/config.service';
import { SqlDbService } from './sqldb.service';
import { ConfigModule } from 'src/default/config/config.module';
import { ConsoleLogger } from 'src/default/logger/console/console.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      name: 'sqlDbConnection',
      imports: [ConfigModule],
      useFactory: sqlDbConfig,
      inject: [AppConfigService],
    }),
  ],
  providers: [SqlDbService],
  exports: [SqlDbService, TypeOrmModule],
})
export class SqlDbModule implements OnModuleInit {
  async onModuleInit() {
    ConsoleLogger.log(
      'SQL DB Module: Connection established successfully!',
      'SqldbModule',
    );
  }
}
