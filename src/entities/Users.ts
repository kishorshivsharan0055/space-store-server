import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity({
  name: "Users",
})
export class Users extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  user_id: string;

  @Field()
  @Column({ type: "text" })
  first_Name!: string;

  @Field()
  @Column({ type: "text" })
  last_Name!: string;

  @Field()
  @Column({ type: "text" })
  email!: string;

  @Field(() => String, { nullable: false })
  @Column({ nullable: true })
  phoneNo?: string;

  @Field(() => String, { nullable: false })
  @Column({ nullable: true })
  type: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  avatar_url?: string;

  @CreateDateColumn()
  date_created: Date;

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
