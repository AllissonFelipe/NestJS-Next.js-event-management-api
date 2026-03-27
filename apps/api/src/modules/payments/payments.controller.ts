import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Controller('payment')
export class PaymentsController {
  constructor() {}

  @Public()
  @Get('success')
  async getSuccess() {
    return {
      success: 'Sucesso'
    };
  }

  @Public()
  @Get('failure')
  async getFailure() {
    return {
      failure: 'Falha'
    };
  }

  @Public()
  @Get('pending')
  async getPending() {
    return {
      pending: 'Em andamento'
    };
  }
}
