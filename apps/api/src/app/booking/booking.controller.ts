import { throwExpression, throwIfNullish } from '@irrigation/shared/util';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
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
import { map, Observable, switchMap } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AuthenticatedUserGuard } from '../guards/authenticated-user.guard';
import { CreateBookingDTO } from '../model/api/booking/booking.dto';
import { Booking } from '../model/api/booking/booking.model';
import { PassportRequest } from '../model/Passport';
import { BookingService } from './booking.service';

@UseGuards(JwtAuthGuard, AuthenticatedUserGuard)
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
    return this.bookingService.findOneById(id).pipe(
      // check if booking exists
      map((booking) => throwIfNullish(booking, new NotFoundException())),
      switchMap((booking) =>
        // check if user is admin or creator of booking
        req.user.admin || req.user.id === booking.by.id
          ? this.bookingService.deleteById(id)
          : throwExpression(new ForbiddenException())
      )
    );
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
