import { removeNullish } from '@irrigation/shared/util';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { CreatePumpDTO, UpdatePumpDTO } from '../model/api/pump/pump.dto';
import { Pump, PumpDocument } from '../model/api/pump/pump.model';

@Injectable()
export class PumpService {
  public constructor(
    @InjectModel(Pump.name) private readonly model: Model<PumpDocument>
  ) {}

  public createOne(dto: CreatePumpDTO): Observable<Pump> {
    return from(this.model.create(dto));
  }

  public updateOne(id: string, dto: UpdatePumpDTO): Observable<Pump> {
    return from(
      this.model.findByIdAndUpdate(id, { ...removeNullish(dto) }, { new: true })
    );
  }
}
