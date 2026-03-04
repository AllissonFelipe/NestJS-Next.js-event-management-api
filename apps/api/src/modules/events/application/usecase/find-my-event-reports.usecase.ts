import { Injectable } from '@nestjs/common';
import { MyEventsReportsWithQueryResponseDto } from '../responses/event-reports/my-event-report.response-dto';

@Injectable()
export class FindMyEventReportsUseCase {
  constructor() {}

  async execute(
    userPersonId: string,
    dto: MyEventReportsQueryDto,
  ): Promise<MyEventsReportsWithQueryResponseDto> {}
}
