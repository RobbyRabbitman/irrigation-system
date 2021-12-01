import {
  CreateIrrigationSystemDTO,
  Identifyable,
  IrrigationSystem,
  IrrigationSystemDocument,
  IrrigationSystemName,
} from '@irrigation/shared/model';
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

  public findOne(id: string): Observable<IrrigationSystemDocument> {
    return from(this.model.findById(id));
  }

  public createOne(
    value: CreateIrrigationSystemDTO
  ): Observable<IrrigationSystemDocument> {
    return from(this.model.create(value));
  }

  public addPumps(
    irrigationSystem: string,
    pumps: Identifyable[]
  ): Observable<IrrigationSystem> {
    return from(
      this.model.findByIdAndUpdate(
        irrigationSystem,
        {
          $addToSet: { pumps },
        },
        { new: true }
      )
    );
  }
}
