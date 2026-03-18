import { PersonOrmEntity } from '../../person/infra/person.orm-entity';
import { SubscriptionPlansOrmEntity } from '../../subscription-plans/infra/subscription-plans.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionStatusEnum } from '../domain/subscription-status.enum';

@Entity('subscription')
export class SubscriptionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PersonOrmEntity, (person) => person.subscriptions)
  @JoinColumn({ name: 'person_id' })
  person: PersonOrmEntity;

  @ManyToOne(
    () => SubscriptionPlansOrmEntity,
    (subscriptionPlan) => subscriptionPlan.subscriptions,
  )
  @JoinColumn({ name: 'subscription_plan_id' })
  subscription_plan: SubscriptionPlansOrmEntity;

  @Column()
  start_at: Date;

  @Column()
  end_at: Date;

  @Column({
    type: 'enum',
    enum: SubscriptionStatusEnum,
  })
  status: SubscriptionStatusEnum;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
