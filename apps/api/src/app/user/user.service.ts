import {
  User,
  UserDocument,
  UpdateUserDTO,
  UserName,
  CreateUserDTO,
} from '@irrigation/shared/model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { removeNullish } from '@irrigation/shared/util';
@Injectable()
export class UserService {
  public constructor(
    @InjectModel(UserName)
    private readonly model: Model<UserDocument>
  ) {}

  /**
   *
   * @param username
   * @returns user with password...care
   */
  public getOne(username: string): Observable<User | undefined> {
    return from(
      this.model
        .findOne()
        .where('username')
        .equals(username)
        .select('+password')
    );
  }

  public findAll(): Observable<User[]> {
    return from(this.model.find().exec());
  }

  public create(dto: CreateUserDTO): Observable<User> {
    return from(this.model.create(dto));
  }

  public findOneById(id: string): Observable<User | undefined> {
    return from(this.model.findById(id));
  }

  public update(id: string, dto: UpdateUserDTO) {
    return from(
      this.model.findByIdAndUpdate(
        id,
        {
          ...removeNullish(dto),
        },
        { new: true }
      )
    );
  }

  public updateIrrigationSystems(
    id: string,
    irrigationSystem: string,
    op: '$addToSet' | '$pull'
  ) {
    return from(
      this.model.findByIdAndUpdate(
        id,
        {
          [op]: { irrigationSystems: irrigationSystem },
        },
        { new: true }
      )
    );
  }
}
