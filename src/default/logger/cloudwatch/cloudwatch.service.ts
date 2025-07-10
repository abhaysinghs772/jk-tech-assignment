import {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  DescribeLogGroupsCommand,
  DescribeLogStreamsCommand,
  PutLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppConfigService } from 'src/default/config/config.service';
import { EventsType } from 'src/default/common/constants/events.option';
import { DataSanitizer } from 'src/default/common/utils/sanitize.utils';
import { Formatter } from 'src/default/common/utils/format.util';

@Injectable()
export class CloudwatchService implements OnModuleInit {
  private cloudWatchClient: CloudWatchLogsClient | null = null;
  private logGroupName: string;
  private logStreamName: string;
  private isProduction: boolean;

  constructor(private readonly appConfigService: AppConfigService) {
    const nodeEnv = this.appConfigService.get('NODE_ENV') || 'development';
    this.isProduction = nodeEnv === 'production';

    if (this.isProduction) {
      const awsRegion = this.appConfigService.get('AWS_REGION');
      const awsAccessKeyId = this.appConfigService.get('AWS_ACCESS_KEY_ID');
      const awsSecretAccessKey = this.appConfigService.get(
        'AWS_SECRET_ACCESS_KEY',
      );
      this.logGroupName = this.appConfigService.get('APP_NAME') || 'NestJSLogs';

      const todayDate = new Date().toISOString().split('T')[0];
      this.logStreamName = `${this.logGroupName}-stream-${todayDate}`;

      this.cloudWatchClient = new CloudWatchLogsClient({
        region: awsRegion,
        credentials: {
          accessKeyId: awsAccessKeyId,
          secretAccessKey: awsSecretAccessKey,
        },
      });
    }
  }

  async onModuleInit() {
    if (this.isProduction && this.cloudWatchClient) {
      await this.initializeLoggingResources();
    }
  }

  private async initializeLoggingResources() {
    await this.ensureLogGroupExists();
    await this.ensureLogStreamExists();
  }

  private async ensureLogGroupExists() {
    if (!this.isProduction || !this.cloudWatchClient) return;

    const describeLogGroupsCommand = new DescribeLogGroupsCommand({
      logGroupNamePrefix: this.logGroupName,
    });

    const { logGroups } = await this.cloudWatchClient.send(
      describeLogGroupsCommand,
    );
    const logGroupExists = logGroups?.some(
      (group) => group.logGroupName === this.logGroupName,
    );

    if (!logGroupExists) {
      const createLogGroupCommand = new CreateLogGroupCommand({
        logGroupName: this.logGroupName,
      });
      await this.cloudWatchClient.send(createLogGroupCommand);
    }
  }

  private async ensureLogStreamExists() {
    if (!this.isProduction || !this.cloudWatchClient) return;

    const describeStreamsCommand = new DescribeLogStreamsCommand({
      logGroupName: this.logGroupName,
      logStreamNamePrefix: this.logStreamName,
    });

    const { logStreams } = await this.cloudWatchClient.send(
      describeStreamsCommand,
    );
    const logStreamExists = logStreams?.some(
      (stream) => stream.logStreamName === this.logStreamName,
    );

    if (!logStreamExists) {
      const createLogStreamCommand = new CreateLogStreamCommand({
        logGroupName: this.logGroupName,
        logStreamName: this.logStreamName,
      });
      await this.cloudWatchClient.send(createLogStreamCommand);
    }
  }

  @OnEvent(EventsType.REMOTE_LOG)
  async handleRemoteLogEvent(payload: any) {
    if (!this.isProduction || !this.cloudWatchClient) return;

    try {
      // Sanitize the payload to ensure no sensitive data
      const sanitizedPayload = DataSanitizer.sanitizeData(
        payload,
        [],
        ['password', 'accessToken', 'refreshToken'],
      );

      // Format trace into an array of lines
      if (sanitizedPayload.trace) {
        sanitizedPayload.trace = Formatter.formatStackTrace(
          sanitizedPayload.trace,
        );
      }

      // Ensure `sanitizedPayload` is sent as a proper JSON object
      const putLogEventsCommand = new PutLogEventsCommand({
        logGroupName: this.logGroupName,
        logStreamName: this.logStreamName,
        logEvents: [
          {
            message: JSON.stringify(sanitizedPayload), // Stringify only for CloudWatch API
            timestamp: Date.now(),
          },
        ],
      });

      await this.cloudWatchClient.send(putLogEventsCommand);
    } catch (error) {
      console.error('Failed to send log to CloudWatch:', error);
    }
  }
}
