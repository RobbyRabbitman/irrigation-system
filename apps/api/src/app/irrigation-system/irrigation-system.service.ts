import {
  CreateIrrigationSystemDTO,
  IrrigationSystem,
  IrrigationSystemDocument,
  IrrigationSystemName,
  UpdateIrrigationSystemDTO,
} from '@irrigation/shared/model';
import { removeNullish } from '@irrigation/shared/util';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';

@Injectable()
export class IrrigationSystemService {
  public constructor(
    @InjectModel(IrrigationSystemName)
    private readonly model: Model<IrrigationSystemDocument>
  ) {}

  public findOne(id: string): Observable<IrrigationSystem> {
    return from(this.model.findById(id).populate('pumps'));
  }

  public findAll(): Observable<IrrigationSystem[]> {
    return from(this.model.find().populate('pumps').exec());
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
      this.model
        .findByIdAndUpdate(id, { ...removeNullish(dto) }, { new: true })
        .populate('pumps')
    );
  }

  public updatePumps(id: string, pump: string, op: '$addToSet' | '$pull') {
    return from(
      this.model
        .findByIdAndUpdate(
          id,
          {
            [op]: { pumps: pump },
          },
          { new: true }
        )
        .populate('pumps')
    );
  }
}
