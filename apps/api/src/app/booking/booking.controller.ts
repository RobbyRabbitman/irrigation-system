import { Booking, CreateBookingDTO } from '@irrigation/shared/model';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { switchMap } from 'rxjs';
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
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return this.bookingService.inPeriod(dto.pump, dto.from, dto.to).pipe(
      switchMap((bookings) => {
        if (
          bookings.some(
            (b) =>
              (b.from > dto.from && b.to < dto.to) ||
              (b.from <= dto.from && b.to > dto.from) ||
              (b.from < dto.to && b.to <= dto.to)
          )
        )
          throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        return this.bookingService.create(dto);
      })
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
      !req.user.irrigationSystems.some((x) =>
        x.pumps.map((pump) => pump.id).includes(pump)
      ) &&
      !req.user.admin
    )
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return this.bookingService.inPeriod(pump, from, to);
  }
}
