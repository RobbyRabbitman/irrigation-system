export * from './auth.service';
import { AuthService } from './auth.service';
export * from './booking.service';
import { BookingService } from './booking.service';
export * from './irrigationSystem.service';
import { IrrigationSystemService } from './irrigationSystem.service';
export * from './pump.service';
import { PumpService } from './pump.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [
  AuthService,
  BookingService,
  IrrigationSystemService,
  PumpService,
  UserService,
];
