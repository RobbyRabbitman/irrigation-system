import {
  CreateIrrigationSystemDTO,
  IrrigationSystem,
  IrrigationSystemDocument,
  IrrigationSystemName,
  UpdateIrrigationSystemDTO,
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
    { name, pumps }: UpdateIrrigationSystemDTO
  ): Observable<IrrigationSystem> {
    return from(
      this.model.findByIdAndUpdate(
        id,
        { name, $addToSet: { pumps } },
        { new: true }
      )
    );
  }
}
