import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { ILike, In } from "typeorm";
import { NOT_LOGGED_IN_ERROR } from "../constants";
import { Users } from "../entities/Users";
import { Context, CustomError } from "../types/types";

@ObjectType()
export class UserResponse {
  @Field(() => CustomError, { nullable: true })
  error?: CustomError;
  @Field(() => Users, { nullable: true })
  user?: Users;
}

@ObjectType()
export class AdminResponse {
  @Field(() => CustomError, { nullable: true })
  error?: CustomError;
  @Field(() => String, { nullable: true })
  userId?: string;
}

@InputType()
export class UserInput {
  @Field({ nullable: true })
  first_name?: string;

  @Field({ nullable: true })
  last_name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  avatar_url?: string;

  @Field({ nullable: true })
  phoneNo?: string;

  @Field({ nullable: true })
  type?: "CUSTOMER" | "ADMIN";

  @Field({ nullable: true })
  address_1?: string;

  @Field({ nullable: true })
  address_2?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  postcode?: string;

  @Field({ nullable: true })
  state?: string;
}

@Resolver(() => Users)
export class UserResolver {
  // Get all users
  // @Authorized("admin")
  @Query(() => [Users])
  async listUsers(): Promise<Users[]> {
    return await Users.find({});
  }

  // Currently Signed in User
  @Authorized()
  @Query(() => Users, { nullable: true })
  async currentUser(@Ctx() { req }: Context): Promise<Users | null> {
    if (!req.authId) {
      return null;
    }
    const currentUser = await Users.findOne(req.authId);
    if (!currentUser) {
      return null;
    } else {
      return currentUser;
    }
  }

  @Mutation(() => Users, { nullable: true })
  async getUserById(
    @Arg("user_id", () => String) user_id: string
  ): Promise<Users | undefined> {
    return await Users.findOne({ where: { user_id: user_id } });
  }

  @Mutation(() => Users, { nullable: true })
  async checkUserExists(
    @Arg("phoneNo", () => String) phoneNo: string
  ): Promise<Users | undefined> {
    return await Users.findOne({
      where: {
        phoneNo,
      },
    });
  }

  @Query(() => [Users])
  async searchUser(@Arg("name") name: string): Promise<Users[]> {
    return await Users.find({
      where: {
        name: ILike(`%${name}%`),
      },
    });
  }

  // User Registration
  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("data") data: UserInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    try {
      const userExists = await Users.findOne({
        where: { phoneNo: data.phoneNo },
      });

      if (userExists) {
        userExists.save();
        return {
          user: userExists,
        };
      } else {
        const user = await Users.create({
          first_Name: data.first_name,
          last_Name: data.last_name,
          email: data.email,
          phoneNo: data.phoneNo,
          type: data.type,
          city: data.city,
          address_1: data.address_1,
          address_2: data.address_2,
          avatar_url: data.avatar_url,
          postcode: data.postcode,
        }).save();
        console.log("[registerUser] Sign up Success");

        return {
          user,
        };
      }
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

  @Mutation(() => UserResponse)
  async updateUser(@Arg("data") data: UserInput): Promise<UserResponse> {
    const currentUser = await Users.findOne({
      where: { phoneNo: data.phoneNo },
    });

    if (!currentUser) {
      return {
        error: NOT_LOGGED_IN_ERROR,
      };
    }

    Object.assign(currentUser, data);

    await currentUser.save();
    return {
      user: currentUser,
    };
  }

  // User Delete
  @Authorized()
  @Mutation(() => Boolean)
  async deleteUser(@Ctx() { req }: Context): Promise<boolean> {
    if (!req.authId) return false;

    const currentUser = await Users.findOne(req.authId);
    if (!currentUser) {
      return false;
    } else {
      await Users.delete(currentUser.user_id);
      try {
        req.authId = null;
        req.authToken = null;
      } catch (error) {
        console.error(error);
      }
      return true;
    }
  }

  // User Logout
  @Mutation(() => Boolean)
  logoutUser(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve) => {
      (req as any).session.destroy((err: any) => {
        res.clearCookie("qid");
        req.authId = null;
        req.authToken = null;
        if (err) {
          console.error(err);
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }
}
