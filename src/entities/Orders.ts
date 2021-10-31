import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Products } from "./Products";

@ObjectType()
@Entity()
export class Orders extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  razorpay_order_id!: string;

  @Field()
  @Column({ type: "text" })
  payment_method!: string;

  @Field()
  @Column({ type: "text" })
  customer_id!: string;

  @Field(() => String, { nullable: false })
  @Column({ type: "text", nullable: true })
  order_status?: string;

  @Field(() => String, { nullable: false })
  @Column({ nullable: true })
  payment_status: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  amount?: string;

  @Field(() => [Products], { nullable: true })
  @Column({ nullable: true, type: "jsonb", array: false })
  products: Products[];

  @Field(() => String)
  @CreateDateColumn()
  date_created: Date;

  @Field(() => String)
  @UpdateDateColumn()
  date_modified: Date;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  address_1?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  address_2?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  postcode?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  state!: string;
}
