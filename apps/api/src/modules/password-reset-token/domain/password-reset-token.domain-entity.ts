/* eslint-disable prettier/prettier */
import { randomUUID } from "crypto";

export class PasswordResetTokenDomainEntity {
    private _id: string;
    private _personId: string;
    private _token: string;
    private _expiresAt: Date;
    private _usedAt: Date | null;

    private constructor (props: {
        id: string;
        personId: string;
        token: string;
        expiresAt: Date;
        usedAt: Date | null;
    }) {
        this._id = props.id;
        this._personId = props.personId;
        this._token = props.token;
        this._expiresAt = props.expiresAt;
        this._usedAt = props.usedAt
    };

    get id(): string {
        return this._id;
    }
    get personId(): string {
        return this._personId;
    }
    get token(): string {
        return this._token;
    }
    get expiresAt(): Date {
        return this._expiresAt;
    }
    get usedAt(): Date | null {
        return this._usedAt;
    }

    markAsUsed() {
        if(this._usedAt) {
            throw new Error(`Token ja foi usado`);
        }
        if(this.isExpired()) {
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
        usedAt?: Date | null;
    }): PasswordResetTokenDomainEntity {
        return new PasswordResetTokenDomainEntity({
            id: randomUUID(),
            token: params.token,
            personId: params.personId,
            expiresAt: params.expiresAt,
            usedAt: null,
        })
    };

    static restore(props: {
        id: string;
        personId: string;
        token: string;
        expiresAt: Date;
        usedAt: Date | null;
    }): PasswordResetTokenDomainEntity {
        return new PasswordResetTokenDomainEntity({
            id: props.id,
            personId: props.personId,
            token: props.token,
            expiresAt: props.expiresAt,
            usedAt: props.usedAt,
        });
    };
}