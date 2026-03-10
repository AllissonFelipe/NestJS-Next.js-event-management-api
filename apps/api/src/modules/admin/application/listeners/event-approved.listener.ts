import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventsDomainEntity } from 'src/modules/events/domain/events.domain-entity';
import {
  MAIL_SERVICE,
  type MailServiceInterface,
} from 'src/modules/mail/domain/mail-service.interface';

@Injectable()
export class EventApprovedListener {
  constructor(
    @Inject(MAIL_SERVICE)
    private readonly emailService: MailServiceInterface,
  ) {}

  @OnEvent('event.approved')
  async handle(event: EventsDomainEntity) {
    await this.emailService.sendEventApprovedEmail(
      event.createdBy.email,
      event,
    );
  }
}
