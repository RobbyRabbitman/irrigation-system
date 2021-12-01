import {
  User,
  UserDocument,
  UpdateUserDTO,
  UserName,
  CreateUserDTO,
  Pump,
} from '@irrigation/shared/model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { removeFalsy } from '@irrigation/shared/util';
@Injectable()
export class UserService {
  public constructor(
    @InjectModel(UserName)
    private readonly model: Model<UserDocument>
  ) {}

  public getOne(username: string): Observable<User | undefined> {
    return from(
      this.model
        .findOne()
        .where('username')
        .equals(username)
        .populate('irrigationSystems')
        .populate({
          path: 'irrigationSystems',
          populate: {
            path: 'pumps',
            model: Pump.name,
          },
        })
    );
  }

  public create(dto: CreateUserDTO): Observable<User> {
    return from(this.model.create(dto));
  }

  public findOneById(id: string): Observable<User | undefined> {
    return from(
      this.model
        .findById(id)
        .populate('irrigationSystems')
        .populate({
          path: 'irrigationSystems',
          populate: {
            path: 'pumps',
            model: Pump.name,
          },
        })
    );
  }

  public update(id: string, { irrigationSystems, ...rest }: UpdateUserDTO) {
    return from(
      this.model
        .findByIdAndUpdate(
          id,
          {
            ...removeFalsy(rest),
            $addToSet: { irrigationSystems },
          },
          { new: true }
        )
        .populate('irrigationSystems')
        .populate({
          path: 'irrigationSystems',
          populate: {
            path: 'pumps',
            model: Pump.name,
          },
        })
    );
  }
}
