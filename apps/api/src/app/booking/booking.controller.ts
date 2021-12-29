import { Booking, CreateBookingDTO } from '@irrigation/shared/model';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
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
@ApiTags(BookingController.RESOURCE)
@Controller(BookingController.RESOURCE)
export class BookingController {
  public static readonly RESOURCE = 'booking';
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
          throw new BadRequestException();
        return this.bookingService.create(dto);
      })
    );
  }

  @ApiNoContentResponse()
  @Delete(`:${BookingController.RESOURCE}`)
  public deleteBooking(
    @Req() req: PassportRequest,
    @Param(BookingController.RESOURCE) id: string
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
      // check if user must access this pump
      !req.user.irrigationSystems.some(({ pumps }) =>
        pumps.map(({ id }) => id).includes(pump)
      )
    )
      throw new ForbiddenException();
    return this.bookingService.inPeriod(pump, from, to);
  }
}
