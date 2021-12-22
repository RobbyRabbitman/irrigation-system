import {
  CreatePumpDTO,
  Pump,
  PumpDocument,
  UpdatePumpDTO,
} from '@irrigation/shared/model';
import { removeNullish } from '@irrigation/shared/util';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { from, Observable } from 'rxjs';

@Injectable()
export class PumpService {
  public constructor(
    @InjectModel(Pump.name) private readonly pump: Model<PumpDocument>
  ) {}

  public create(dto: CreatePumpDTO): Observable<Pump> {
    return from(this.pump.create({ ...dto, _id: new Types.ObjectId() }));
  }

  public updateOne(id: string, dto: UpdatePumpDTO): Observable<Pump> {
    return from(
      this.pump.findByIdAndUpdate(id, { ...removeNullish(dto) }, { new: true })
    );
  }
}
