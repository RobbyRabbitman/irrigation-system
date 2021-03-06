import { removeNullish } from '@irrigation/shared/util';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import {
  CreateIrrigationSystemDTO,
  UpdateIrrigationSystemDTO,
} from '../model/api/irrigation-system/irrigation-system.dto';
import {
  IrrigationSystemName,
  IrrigationSystemDocument,
  IrrigationSystem,
} from '../model/api/irrigation-system/irrigation-system.model';

@Injectable()
export class IrrigationSystemService {
  public constructor(
    @InjectModel(IrrigationSystemName)
    private readonly model: Model<IrrigationSystemDocument>
  ) {}

  public findOne(id: string): Observable<IrrigationSystem> {
    return from(this.model.findById(id));
  }

  public findAll(): Observable<IrrigationSystem[]> {
    return from(this.model.find().exec());
  }

  public createOne(
    value: CreateIrrigationSystemDTO
  ): Observable<IrrigationSystem> {
    return from(this.model.create(value));
  }

  public updateOne(
    id: string,
    dto: UpdateIrrigationSystemDTO
  ): Observable<IrrigationSystem> {
    return from(
      this.model.findByIdAndUpdate(id, { ...removeNullish(dto) }, { new: true })
    );
  }

  public updatePumps(id: string, pump: string, op: '$addToSet' | '$pull') {
    return from(
      this.model.findByIdAndUpdate(
        id,
        {
          [op]: { pumps: pump },
        },
        { new: true }
      )
    );
  }
}
