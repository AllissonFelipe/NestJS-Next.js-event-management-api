/* eslint-disable prettier/prettier */
import { randomUUID } from "crypto";
import { PersonRoleEnum } from "./person-role.enum";


export class PersonRoleDomainEntity {
  private _id: string;
  private _role: PersonRoleEnum;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: {
    id: string;
    role: PersonRoleEnum;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._role = props.role;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // ----------------- GETTERS -----------------

  get id(): string {
    return this._id;
  }

  get role(): PersonRoleEnum {
    return this._role;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt);
  }

  // ----------------- BEHAVIOR -----------------

//   updateRole(role: PersonRoleEnum) {
//     if (!role) throw new Error('Role is required');
//     this._role = role;
//     this.touch();
//   }

  private touch() {
    this._updatedAt = new Date();
  }

  // ----------------- FACTORIES -----------------

  /**
   * Cria um novo Role (ex: seed inicial do sistema)
   */
  static create(params: {
    id?: string;
    role: PersonRoleEnum;
  }): PersonRoleDomainEntity {
    if (!params.role) {
      throw new Error('Person role is required');
    }

    const now = new Date();

    return new PersonRoleDomainEntity({
      id: params.id || randomUUID(),
      role: params.role,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Restaura um Role existente (ex.: vindo do banco)
   */
  static restore(params: {
    id: string;
    role: PersonRoleEnum;
    createdAt: Date;
    updatedAt: Date;
  }): PersonRoleDomainEntity {
    return new PersonRoleDomainEntity({
      id: params.id,
      role: params.role,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
  }
}
