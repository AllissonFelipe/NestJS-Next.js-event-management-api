import { NotFoundException } from '@nestjs/common';

export class ActivationTokenNotFoundError extends NotFoundException {
  constructor() {
    super('Token de ativação não encontrado');
    this.name = 'ActivationTokenNotFoundError';
  }
}
