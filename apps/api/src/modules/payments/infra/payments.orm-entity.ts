import { SubscriptionOrmEntity } from '../../subscription/infra/subscription.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ProvidersEnum } from '../domain/providers.enum';
import { PaymentsStatusEnum } from '../domain/payments-status.enum';
import { PaymentMethodEnum } from '../domain/payments-method.enum';

@Entity('payments')
export class PaymentsOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SubscriptionOrmEntity)
  @JoinColumn({ name: 'subscription_id' })
  subscription: SubscriptionOrmEntity;

  @Column({
    type: 'enum',
    enum: ProvidersEnum
  })
  provider: ProvidersEnum;

  @Column({ name: 'external_session_id', nullable: true })
  external_session_id?: string;

  @Column({ name: 'external_payment_id', nullable: true })
  external_payment_id?: string;

  @Column({ name: 'payment_url', nullable: true })
  payment_url?: string;

  @Column({
    type: 'enum',
    enum: PaymentMethodEnum,
    name: 'payment_method',
    nullable: true
  })
  payment_method?: PaymentMethodEnum;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'currency', default: 'BRL' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentsStatusEnum,
    name: 'status'
  })
  status: PaymentsStatusEnum;

  @Column({ name: 'paid_at', nullable: true })
  paid_at?: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
