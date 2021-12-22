import { Booking, CreateBookingDTO, OBJECT_ID } from '@irrigation/shared/model';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable, switchMap } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PassportRequest } from '../model/Passport';
import { BookingService } from './booking.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('booking')
@Controller('booking')
export class BookingController {
  public constructor(private readonly bookingService: BookingService) {}

  @ApiCreatedResponse({ type: Booking })
  @Post()
  public createBooking(
    @Req() req: PassportRequest,
    @Body() dto: CreateBookingDTO
  ) {
    if (
      !req.user.irrigationSystems.some((x) =>
        x.pumps.map((pump) => pump.id).includes(dto.pump)
      ) ||
      req.user.id !== dto.by
    )
      throw new ForbiddenException();
    return this.bookingService.inPeriod(dto.pump, dto.from, dto.to).pipe(
      switchMap((bookings) => {
        if (
          dto.from >= dto.to ||
          bookings.some(({ from, to }) => dto.to > from && dto.from < to)
        )
          throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        return this.bookingService.create(dto);
      })
    );
  }

  @ApiNoContentResponse()
  @Delete(`:${OBJECT_ID}`)
  public deleteBooking(
    @Req() req: PassportRequest,
    @Param(OBJECT_ID) id: string
  ): Observable<void> {
    if (!req.user.admin && req.user.id !== id) throw new ForbiddenException();
    else return this.bookingService.deleteById(id);
  }

  @ApiOkResponse({ isArray: true, type: Booking })
  @Get()
  public inPeriod(
    @Req() req: PassportRequest,
    @Query('pump') pump: string,
    @Query('from') from: number,
    @Query('to') to: number
  ) {
    if (
      !req.user.irrigationSystems.some((x) =>
        x.pumps.map((pump) => pump.id).includes(pump)
      ) &&
      !req.user.admin
    )
      throw new ForbiddenException();
    return this.bookingService.inPeriod(pump, from, to);
  }
}
