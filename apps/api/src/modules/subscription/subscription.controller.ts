import { Controller, Get } from '@nestjs/common';

@Controller('subscriptions')
export class SubscriptionController {
  constructor() {}

  @Get('plans')
  async findSubscriptionPlans(): Promise<void> {}
}
