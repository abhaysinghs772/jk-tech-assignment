import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConsoleLogger } from 'src/default/logger/console/console.service';

@Injectable()
export class SqlDbService {
  constructor(
    @InjectDataSource('sqlDbConnection')
    private readonly dataSource: DataSource,
  ) {}

  async runCustomQuery(query: string, parameters?: any[]): Promise<any> {
    ConsoleLogger.log(query);
    return this.dataSource.query(query, parameters);
  }
}
