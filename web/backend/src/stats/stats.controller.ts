import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly spending by category' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'month', required: true, type: Number })
  getMonthlyStats(
    @Request() req: any,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.statsService.getMonthlyStats(
      req.user.userId,
      parseInt(year),
      parseInt(month),
    );
  }

  @Get('yearly-trend')
  @ApiOperation({ summary: 'Get yearly spending trend' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  getYearlyTrend(@Request() req: any, @Query('year') year: string) {
    return this.statsService.getYearlyTrend(req.user.userId, parseInt(year));
  }
}
