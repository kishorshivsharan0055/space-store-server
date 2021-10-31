import { Orders } from "src/entities/Orders";
import { Context, CustomError } from "src/types/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

@ObjectType()
export class OrderResponse {
  @Field(() => CustomError, { nullable: true })
  error?: CustomError;
  @Field(() => Orders, { nullable: true })
  order?: Orders;
}

@InputType()
export class OrderInput {
  @Field(() => String, { nullable: true })
  razorpay_order_id!: string;

  @Field()
  payment_method!: string;

  @Field()
  customer_id!: string;

  @Field(() => String)
  order_status?: string;

  @Field(() => String)
  payment_status: string;

  @Field(() => String)
  amount?: string;

  @Field(() => [String], { nullable: true })
  product_ids: string[];

  @Field(() => String, { nullable: true })
  address_1?: string;

  @Field(() => String, { nullable: true })
  address_2?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  postcode?: string;

  @Field(() => String, { nullable: true })
  state!: string;
}

@Resolver(() => Orders)
export class OrderResolver {
  @Query(() => [Orders])
  async getAllOrders(): Promise<Orders[]> {
    return await Orders.find({
      order: {
        date_created: "DESC",
      },
    });
  }

  @Mutation(() => OrderResponse)
  async placeOrder(
    @Arg("data") data: OrderInput
  ): Promise<OrderResponse | null> {
    try {
      const order = await Orders.create({
        payment_method: data.payment_method,
        payment_status: data.payment_status,
        customer_id: data.customer_id,
        product_ids: data.product_ids,
        order_status: data.order_status,
        amount: data.amount,
        address_1: data.address_1,
        address_2: data.address_2,
        city: data.city,
        postcode: data.postcode,
        state: data.state,
      });

      console.log("Order placed successfully");

      return {
        order,
      };
    } catch (err) {
      console.log(err);
      return {
        error: {
          code: "Server Error",
          message: JSON.stringify(err),
        },
      };
    }
  }
}
