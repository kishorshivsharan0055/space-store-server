import { Products } from "../entities/Products";
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { NOT_LOGGED_IN_ERROR, USER_NOT_FOUND_ERROR } from "../constants";
import { User } from "../entities/User";
import { Context, CustomError } from "../types/types";

@ObjectType()
export class PostResponse {
  @Field(() => CustomError, { nullable: true })
  error?: CustomError;
  @Field(() => Products, { nullable: true })
  post?: Products;
}

@InputType()
export class PostCreateInput {
  @Field({ nullable: false })
  source!: string;

  @Field({ defaultValue: "IMAGE" })
  type!: string;

  @Field({ nullable: true })
  caption?: string;
}

@InputType()
export class PostUpdateInput {
  @Field({ nullable: true })
  caption?: string;
}

@Resolver(() => Products)
export class ProductsResolver {
  // Get all posts
  @Authorized("admin")
  @Query(() => [Products])
  async listAllProducts(): Promise<Products[]> {
    return await Products.find({
      order: {
        date_created: "DESC",
      },
    });
  }

  @Authorized()
  @Query(() => [Products])
  async getPostsForUser(@Ctx() { req }: Context): Promise<Products[]> {
    if (!req.authId) return [];
    return await Products.find({
      order: {
        date_created: "DESC",
      },
      relations: ["user"],
    });
  }

  @Authorized()
  @Query(() => Products, { nullable: true })
  async getPostById(
    @Arg("postId", () => Int) postId: number
  ): Promise<Products | undefined> {
    return await Products.findOne(postId, {
      relations: ["user"],
    });
  }

  @Authorized()
  @Mutation(() => PostResponse)
  async newProducts(
    @Arg("data") data: PostCreateInput,
    @Ctx() { req }: Context
  ): Promise<PostResponse> {
    try {
      if (!req.authId)
        return {
          error: NOT_LOGGED_IN_ERROR,
        };
      const user = await User.findOne(req.authId);

      if (!user)
        return {
          error: USER_NOT_FOUND_ERROR,
        };

      const post = await Products.create({}).save();

      return {
        post,
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

  @Authorized()
  @Mutation(() => PostResponse)
  async updatePost(
    @Arg("postId", () => Int) postId: number,
    @Arg("data") data: PostUpdateInput,
    @Ctx() { req }: Context
  ): Promise<PostResponse> {
    try {
      if (!postId)
        return {
          error: {
            code: "NO_POST_ID",
            message: "PostId was not given",
          },
        };

      if (!req.authId) {
        return {
          error: NOT_LOGGED_IN_ERROR,
        };
      }
      const currentUser = await User.findOne(req.authId);
      if (!currentUser) {
        return {
          error: NOT_LOGGED_IN_ERROR,
        };
      }

      const post = await Products.findOne({
        where: {
          id: postId,
          user: currentUser,
        },
      });
      if (!post)
        return {
          error: {
            code: "POST_NOT_FOUND",
            message: "No post was found with provided Id",
          },
        };
      Object.assign(post, data);

      await post.save();
      return {
        post,
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

  // Post Delete
  @Authorized()
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req }: Context
  ): Promise<boolean> {
    if (!req.authId) return false;

    if (!postId) return false;
    try {
      const currentUser = await User.findOne(req.authId);
      if (!currentUser) {
        console.error("[deletePost] No Current User");
        return false;
      } else {
        const post = await Products.findOne({
          where: {
            id: postId,
            user: currentUser,
          },
        });
        if (!post) return false;

        await post.softRemove();
        return true;
      }
    } catch (err) {
      console.error("[deletePost]", err);
      return false;
    }
  }
}
