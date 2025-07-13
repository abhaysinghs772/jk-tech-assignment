import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    const _1_Kb = 1000;
    const _1_MB = 1000 * _1_Kb;
    const _10_MB = 10 * _1_MB;
    return value.size < _10_MB;
  }
}
