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

  @Field()
  @Column({ type: "text" })
  category!: string;

  @Field()
  @Column({ type: "text" })
  description!: string;

  @Field()
  @Column({ type: "text" })
  short_description!: string;

  @Field()
  @Column({ type: "text" })
  price!: string;

  @Field()
  @Column({ type: "text" })
  sale_price!: string;

  @Field()
  @Column({ type: "text" })
  regular_price!: string;

  @Field()
  @Column({ type: "integer", nullable: true })
  stock_quantity!: number;

  @Field()
  @Column({ type: "text" })
  weight!: string;

  @Field()
  @Column({ type: "text" })
  length!: string;

  @Field()
  @Column({ type: "text" })
  width!: string;

  @Field()
  @Column({ type: "text" })
  height!: string;

  @Field()
  @Column({ type: "text", array: true, nullable: true })
  related_ids!: number;

  @Field()
  @Column({ type: "text", array: true, nullable: true })
  images!: string;

  @Field(() => String)
  @CreateDateColumn()
  date_created = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  date_modified: Date;
}
