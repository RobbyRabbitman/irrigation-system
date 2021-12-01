import { OBJECT_ID } from '@irrigation/shared/model';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    return metadata.type === 'param' && metadata.data === OBJECT_ID
      ? value.toObjectId()
      : value;
  }
}
