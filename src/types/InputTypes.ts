import { Field, InputType, Int } from "type-graphql";

@InputType()
export class ProductInputTypes {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  category!: string;

  @Field(() => String, { nullable: true })
  description!: string;

  @Field(() => String, { nullable: true })
  short_description!: string;

  @Field(() => String, { nullable: true })
  price!: string;

  @Field(() => String, { nullable: true })
  sale_price!: string;

  @Field(() => String, { nullable: true })
  regular_price!: string;

  @Field(() => Number, { nullable: true })
  stock_quantity!: number;

  @Field(() => String, { nullable: true })
  weight!: string;

  @Field(() => String, { nullable: true })
  length!: string;

  @Field(() => String, { nullable: true })
  width!: string;

  @Field(() => String, { nullable: true })
  height!: string;

  @Field(() => String, { nullable: true })
  images!: string;
}
