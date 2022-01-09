import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { OBJECT_ID } from '../model/api/identifyable.model';

@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    return metadata.type === 'param' && metadata.data === OBJECT_ID
      ? value.toObjectId()
      : value;
  }
}
