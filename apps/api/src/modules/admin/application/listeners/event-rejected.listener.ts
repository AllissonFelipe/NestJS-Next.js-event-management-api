import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';
import {
  MAIL_SERVICE,
  type MailServiceInterface,
} from 'src/modules/mail/domain/mail-service.interface';

@Injectable()
export class EventRejectedListener {
  constructor(
    @Inject(MAIL_SERVICE)
    private readonly emailService: MailServiceInterface,
  ) {}

  @OnEvent('event.rejected')
  async handle(event: EventsDomainEntity, reason?: string) {
    await this.emailService.sendEventRejectedEmail(event.createdBy.email, event, reason);
  }
}
