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
import { User } from "../entities/User";
import { Context, CustomError } from "../types/types";
import { getUserInfo } from "../utils/firebaseUtils";

@ObjectType()
export class UserResponse {
  @Field(() => CustomError, { nullable: true })
  error?: CustomError;
  @Field(() => User, { nullable: true })
  user?: User;
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
  profilePic?: string;

  @Field({ nullable: true })
  address_1!: string;

  @Field({ nullable: true })
  address_2!: string;

  @Field({ nullable: true })
  city!: string;

  @Field({ nullable: true })
  postcode!: string;

  @Field({ nullable: true })
  state!: string;
}

@ObjectType()
export class UserStatus {
  @Field(() => Boolean, { defaultValue: false })
  isOnline: boolean;

  @Field(() => String, { nullable: true })
  typingFor?: string;

  @Field(() => String)
  lastSeen: string;

  @Field(() => String)
  userId: string;
}

@Resolver(() => User)
export class UserResolver {
  // Get all users
  @Authorized("admin")
  @Query(() => [User])
  async listUsers(): Promise<User[]> {
    return await User.find({});
  }

  // Currently Signed in User
  @Authorized()
  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() { req }: Context): Promise<User | null> {
    if (!req.authId) {
      return null;
    }
    const currentUser = await User.findOne(req.authId);
    if (!currentUser) {
      return null;
    } else {
      return currentUser;
    }
  }

  @Query(() => User, { nullable: true })
  async getUserById(
    @Arg("userId", () => String) userId: string
  ): Promise<User | undefined> {
    return await User.findOne(userId);
  }

  @Authorized()
  @Query(() => [User], { nullable: true })
  async getUsersFromContacts(
    @Arg("contacts", () => [String]) contacts: string[]
  ): Promise<User[] | undefined> {
    return await User.find({
      where: {
        phoneNo: In(contacts),
      },
    });
  }

  @Mutation(() => User, { nullable: true })
  async checkUserExists(
    @Arg("phoneNo", () => String) phoneNo: string
  ): Promise<User | undefined> {
    return await User.findOne({
      where: {
        phoneNo,
      },
    });
  }

  @Query(() => [User])
  async searchUser(@Arg("name") name: string): Promise<User[]> {
    return await User.find({
      where: {
        name: ILike(`%${name}%`),
      },
    });
  }

  // User Registration
  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("name") name: string,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    try {
      const userInfo = await getUserInfo(req.authToken);
      if (!userInfo)
        return {
          error: {
            code: "AUTH_ERROR",
            message: "Failed to get User Info from auth token",
          },
        };
      const userExists = await User.findOne(userInfo.uid);

      if (userExists) {
        userExists.save();
        return {
          user: userExists,
        };
      } else {
        const user = await User.create({}).save();
        console.log("[registerUser] Sign up Success", userInfo.email);

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

  // User Update
  @Authorized()
  @Mutation(() => UserResponse)
  async updateUser(
    @Arg("data") data: UserInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
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

    const currentUser = await User.findOne(req.authId);
    if (!currentUser) {
      return false;
    } else {
      await User.delete(currentUser.userId);
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
