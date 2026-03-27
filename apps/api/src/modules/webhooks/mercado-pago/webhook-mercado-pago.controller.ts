import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { type Request, type Response } from 'express';
import { HandlePaymentMercadoPagoUseCase } from './handle-payment.usecase';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@Controller('webhooks')
export class WebhookMercadoPagoController {
  constructor(
    @Inject()
    private readonly handlePaymentMercadoPagoUseCase: HandlePaymentMercadoPagoUseCase
  ) {}

  @Public()
  @Post('mercado-pago')
  async handle(@Req() req: Request, @Res() res: Response) {
    await this.handlePaymentMercadoPagoUseCase.execute(req.body);
    return res.sendStatus(200);
  }
}
