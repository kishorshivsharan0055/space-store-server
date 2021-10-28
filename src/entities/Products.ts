import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "products",
})
@ObjectType()
export class Products extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "text" })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text" })
  category!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text" })
  description!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text" })
  short_description!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text" })
  price!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text" })
  sale_price!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text" })
  regular_price!: string;

  @Field(() => Number, { nullable: true })
  @Column({ type: "integer", nullable: true })
  stock_quantity!: number;

  @Field(() => String, { nullable: true })
  @Column({ type: "text" })
  weight!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text" })
  length!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text" })
  width!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text" })
  height!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", array: true, nullable: true })
  related_ids!: string[];

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  images!: string;

  @Field(() => String)
  @CreateDateColumn()
  date_created = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  date_modified: Date;
}
