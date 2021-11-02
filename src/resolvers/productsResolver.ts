import {
  Arg,
  Authorized,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { ILike } from "typeorm";
import { Products } from "../entities/Products";
import { CustomError } from "../types/types";

@ObjectType()
export class ProductResponse {
  @Field(() => CustomError, { nullable: true })
  error?: CustomError;
  @Field(() => Products, { nullable: true })
  product?: Products;
}

@InputType()
export class ProductCreateInput {
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

@Resolver(() => Products)
export class ProductsResolver {
  // Get all posts
  // @Authorized("admin")
  @Query(() => [Products])
  async listAllProducts(): Promise<Products[]> {
    return await Products.find({
      order: {
        date_created: "DESC",
      },
    });
  }

  // Get Products by category
  @Mutation(() => [Products])
  async getProductsByCategory(@Arg("data") data: string): Promise<Products[]> {
    return await Products.find({
      order: {
        date_created: "DESC",
      },
      where: { category: data },
    });
  }

  // add Products
  @Mutation(() => ProductResponse)
  async addProducts(
    @Arg("data") data: ProductCreateInput
  ): Promise<ProductResponse> {
    try {
      const product = await Products.create({
        name: data.name,
        category: data.category,
        description: data.description,
        short_description: data.short_description,
        price: data.price,
        regular_price: data.regular_price,
        sale_price: data.sale_price,
        stock_quantity: data.stock_quantity,
        images: data.images,
        length: data.length,
        width: data.width,
        height: data.height,
        weight: data.weight,
      }).save();
      console.log("[registerUser] Sign up Success");

      return {
        product,
      };
    } catch (err) {
      console.error(err);
      return {
        error: {
          code: "SERVER_ERROR",
          message: JSON.stringify(err),
        },
      };
    }
  }

  // get Products by ID
  @Authorized()
  @Query(() => Products, { nullable: true })
  async getProductsById(
    @Arg("id", () => Int) id: number
  ): Promise<Products | undefined> {
    return await Products.findOne(id);
  }

  @Mutation(() => [Products])
  async searchProducts(@Arg("name") name: string): Promise<Products[]> {
    return await Products.find({
      where: {
        name: ILike(`%${name}%`),
      },
    });
  }
}
