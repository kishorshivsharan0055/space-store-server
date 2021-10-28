import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity({
  name: "users",
})
export class User extends BaseEntity {
  @Field(() => String)
  @PrimaryColumn()
  userId: string;

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
  phoneNo: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  avatar_url?: string;

  @CreateDateColumn()
  date_created: Date;

  @UpdateDateColumn()
  date_modified: Date;

  @Field()
  @Column({ type: "text" })
  address_1!: string;

  @Field()
  @Column({ type: "text" })
  address_2!: string;

  @Field()
  @Column({ type: "text" })
  city!: string;

  @Field()
  @Column({ type: "text" })
  postcode!: string;

  @Field()
  @Column({ type: "text" })
  state!: string;
}
