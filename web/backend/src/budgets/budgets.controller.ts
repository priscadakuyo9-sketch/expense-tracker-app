import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBudgetDto } from './dto/budget.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) { }

  @Post()
  @ApiOperation({ summary: 'Create or update a budget' })
  createOrUpdate(@Body() createBudgetDto: CreateBudgetDto, @Request() req: any) {
    return this.budgetsService.createOrUpdate(createBudgetDto, req.user.userId);
  }

  @Get('current')
  @ApiOperation({ summary: 'Get the current budget' })
  findCurrent(@Request() req: any) {
    return this.budgetsService.findCurrent(req.user.userId);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get budget status and alert for current month' })
  getBudgetStatus(@Request() req: any) {
    return this.budgetsService.getBudgetStatus(req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get budget for a specific period' })
  findByPeriod(@Request() req: any, @Query('period') period: string) {
    return this.budgetsService.findByPeriod(req.user.userId, period);
  }
}
