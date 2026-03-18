import { PersonOrmEntity } from '../../person/infra/person.orm-entity';
import { SubscriptionOrmEntity } from '../../subscription/infra/subscription.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('subscription_plans')
export class SubscriptionPlansOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  duration_in_days: number;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => PersonOrmEntity, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: PersonOrmEntity;

  @OneToMany(
    () => SubscriptionOrmEntity,
    (subscription) => subscription.subscription_plan,
  )
  subscriptions: SubscriptionOrmEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
