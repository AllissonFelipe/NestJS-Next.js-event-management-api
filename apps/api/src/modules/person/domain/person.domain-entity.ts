import { randomUUID } from 'crypto';
import { PersonRoleDomainEntity } from 'src/modules/person-role/domain/person-role.domain-entity';
import { PersonProfileDomainEntity } from 'src/modules/person-profile/domain/person-profile.domain-entity';
import { UpdatePersonDto } from 'src/modules/user/application/dtos/update-user-profile.dto';

export class PersonDomainEntity {
  private _id: string;
  private _fullName: string;
  private _cpf: string;
  private _email: string;
  private _passwordHash: string;
  private _personRole: PersonRoleDomainEntity;
  private _personProfile: PersonProfileDomainEntity;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: {
    id: string;
    fullName: string;
    cpf: string;
    email: string;
    passwordHash: string;
    personRole: PersonRoleDomainEntity;
    personProfile: PersonProfileDomainEntity;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._fullName = props.fullName;
    this._cpf = props.cpf;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._personRole = props.personRole;
    this._personProfile = props.personProfile;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // Getters para todos os atributos
  get id(): string {
    return this._id;
  }

  get fullName(): string {
    return this._fullName;
  }

  get cpf(): string {
    return this._cpf;
  }

  get email(): string {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get personRole(): PersonRoleDomainEntity {
    return this._personRole;
  }

  get personProfile(): PersonProfileDomainEntity {
    return this._personProfile;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos para atualizar atributos que podem mudar
  updateFullName(name: string) {
    if (name !== undefined) {
      this._fullName = name;
      this.touch();
    }
  }
  updateEmail(email: string) {
    if (email !== undefined) {
      this._email = email;
      this.touch();
    }
  }
  updateCpf(cpf: string) {
    if (cpf !== undefined) {
      const normalizedCpf = cpf.replace(/\D/g, '');
      this._cpf = normalizedCpf;
      this.touch();
    }
  }

  updatePassword(hash: string) {
    if (hash !== undefined) {
      this._passwordHash = hash;
      this.touch();
    }
  }
  updateRole(role: PersonRoleDomainEntity) {
    if (role !== undefined) {
      this._personRole = role;
      this.touch();
    }
  }
  updatePersonProfile(profile: PersonProfileDomainEntity) {
    if (profile !== undefined) {
      this._personProfile = profile;
      this.touch();
    }
  }

  updateAll(props: UpdatePersonDto) {
    if (props.fullName !== undefined && props.fullName !== '') {
      this.updateFullName(props.fullName);
    }

    if (props.cpf !== undefined && props.cpf !== '') {
      this.updateCpf(props.cpf);
    }
  }

  private touch() {
    this._updatedAt = new Date();
  }

  // VERIFICAR SE A CONTA ESTÁ ATIVADA
  isAccountActivated(): boolean {
    return this._isActive === true;
  }

  // ACTIVATE ACCOUNT
  activateAccount() {
    this._isActive = true;
  }

  // ----------------- MÉTODOS DE CRIAÇÃO/RESTAURAÇÃO -----------------
  /**
   * Cria um novo Person, gerando ID e timestamps automaticamente
   */
  static create(params: {
    id?: string;
    fullName: string;
    cpf: string;
    email: string;
    passwordHash: string;
    personRole: PersonRoleDomainEntity;
    personProfile: PersonProfileDomainEntity;
    isActive: boolean;
  }): PersonDomainEntity {
    if (!params.fullName) throw new Error('Full name is required');
    if (!params.email.includes('@')) throw new Error('Invalid email');
    if (!params.cpf) throw new Error('CPF is required');
    const now = new Date();
    return new PersonDomainEntity({
      id: params.id || randomUUID(),
      fullName: params.fullName,
      cpf: params.cpf,
      email: params.email,
      passwordHash: params.passwordHash,
      personRole: params.personRole,
      personProfile: params.personProfile,
      isActive: params.isActive,
      createdAt: now,
      updatedAt: now,
    });
  }
  /**
   * Restaura um Person existente (ex.: vindo do banco)
   */
  static restore(params: {
    id: string;
    fullName: string;
    cpf: string;
    email: string;
    passwordHash: string;
    personRole: PersonRoleDomainEntity;
    personProfile: PersonProfileDomainEntity;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): PersonDomainEntity {
    return new PersonDomainEntity({
      id: params.id,
      fullName: params.fullName,
      cpf: params.cpf,
      email: params.email,
      passwordHash: params.passwordHash,
      personRole: params.personRole,
      personProfile: params.personProfile,
      isActive: params.isActive,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
  }
}
