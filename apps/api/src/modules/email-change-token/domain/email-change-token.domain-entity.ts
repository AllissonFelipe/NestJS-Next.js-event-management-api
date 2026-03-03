import { randomUUID } from 'crypto';

export class EmailChangeTokenDomainEntity {
  private _id: string;
  private _personId: string;
  private _token: string;
  private _expiresAt: Date;
  private _newEmail: string;
  private _usedAt: Date | null;

  private constructor(props: {
    id: string;
    personId: string;
    token: string;
    expiresAt: Date;
    newEmail: string;
    usedAt: Date | null;
  }) {
    this._id = props.id;
    this._personId = props.personId;
    this._token = props.token;
    this._expiresAt = props.expiresAt;
    this._newEmail = props.newEmail;
    this._usedAt = props.usedAt;
  }

  get id(): string {
    return this._id;
  }
  get personId(): string {
    return this._personId;
  }
  get token(): string {
    return this._token;
  }
  get newEmail(): string {
    return this._newEmail;
  }
  get expiresAt(): Date {
    return this._expiresAt;
  }
  get usedAt(): Date | null {
    return this._usedAt;
  }

  markAsUsed() {
    if (this._usedAt) {
      throw new Error(`Token ja foi usado`);
    }
    if (this.isExpired()) {
      throw new Error(`Token expirado`);
    }
    this._usedAt = new Date();
  }

  isExpired(referenceDate: Date = new Date()): boolean {
    return this._expiresAt < referenceDate;
  }

  isUsed(): boolean {
    return this._usedAt !== null;
  }

  static create(params: {
    personId: string;
    token: string;
    expiresAt: Date;
    newEmail: string;
    usedAt?: Date | null;
  }): EmailChangeTokenDomainEntity {
    return new EmailChangeTokenDomainEntity({
      id: randomUUID(),
      token: params.token,
      personId: params.personId,
      expiresAt: params.expiresAt,
      newEmail: params.newEmail,
      usedAt: null,
    });
  }

  static restore(props: {
    id: string;
    personId: string;
    token: string;
    expiresAt: Date;
    newEmail: string;
    usedAt: Date | null;
  }): EmailChangeTokenDomainEntity {
    return new EmailChangeTokenDomainEntity({
      id: props.id,
      personId: props.personId,
      token: props.token,
      expiresAt: props.expiresAt,
      newEmail: props.newEmail,
      usedAt: props.usedAt,
    });
  }
}
