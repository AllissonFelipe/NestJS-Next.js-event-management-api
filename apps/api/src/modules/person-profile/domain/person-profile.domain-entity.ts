import { randomUUID } from 'crypto';
import { UpdatePersonProfileDto } from 'src/modules/user/application/dtos/update-user-profile.dto';

export class PersonProfileDomainEntity {
  private _id: string;
  private _avatarUrl?: string;
  private _bio?: string;
  private _phone?: string;
  private _birthDate?: Date;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: {
    id: string;
    avatarUrl?: string;
    bio?: string;
    phone?: string;
    birthDate?: Date;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._avatarUrl = props.avatarUrl;
    this._bio = props.bio;
    this._phone = props.phone;
    this._birthDate = props.birthDate;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // ----------------- GETTERS -----------------
  get id(): string {
    return this._id;
  }
  get avatarUrl(): string | undefined {
    return this._avatarUrl;
  }
  get bio(): string | undefined {
    return this._bio;
  }
  get phone(): string | undefined {
    return this._phone;
  }
  get birthDate(): Date | undefined {
    return this._birthDate;
  }
  get createdAt(): Date {
    return new Date(this._createdAt);
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ----------------- MÉTODOS DE ATUALIZAÇÃO -----------------
  updateAvatarUrl(avatarUrl?: string) {
    if (avatarUrl !== undefined) {
      this._avatarUrl = avatarUrl;
      this.touch();
    }
  }
  updateBio(bio?: string) {
    if (bio !== undefined) {
      this._bio = bio;
      this.touch();
    }
  }
  updatePhone(phone?: string) {
    if (phone !== undefined) {
      this._phone = phone.replace(/\D/g, '');
      this.touch();
    }
  }
  updateBirthDate(date?: Date) {
    if (date !== undefined) {
      this._birthDate = date;
      this.touch();
    }
  }
  private touch() {
    this._updatedAt = new Date();
  }

  updateAll(props: UpdatePersonProfileDto) {
    if (props.avatarUrl !== undefined && props.avatarUrl !== '') {
      this.updateAvatarUrl(props.avatarUrl);
    }

    if (props.bio !== undefined && props.bio !== '') {
      this.updateBio(props.bio);
    }
    if (props.phone !== undefined && props.phone !== '') {
      this.updatePhone(props.phone);
    }
    if (props.birthDate !== undefined) {
      this.updateBirthDate(props.birthDate);
    }
  }

  // ----------------- MÉTODOS DE CRIAÇÃO / RESTAURAÇÃO -----------------

  /**
   * Cria um novo PersonProfile
   */
  static create(params: {
    id?: string;
    avatarUrl?: string;
    bio?: string;
    phone?: string;
    birthDate?: Date;
  }): PersonProfileDomainEntity {
    const now = new Date();
    return new PersonProfileDomainEntity({
      id: params.id || randomUUID(),
      avatarUrl: params.avatarUrl,
      bio: params.bio,
      phone: params.phone,
      birthDate: params.birthDate,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Restaura um PersonProfile existente (ex.: vindo do banco)
   */
  static restore(params: {
    id: string;
    avatarUrl?: string;
    bio?: string;
    phone?: string;
    birthDate?: Date;
    createdAt: Date;
    updatedAt: Date;
  }): PersonProfileDomainEntity {
    return new PersonProfileDomainEntity({
      id: params.id,
      avatarUrl: params.avatarUrl,
      bio: params.bio,
      phone: params.phone,
      birthDate: params.birthDate,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
  }
}
