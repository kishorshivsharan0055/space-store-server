import { Context } from "../types/types";
import { AuthChecker } from "type-graphql";
import { Users } from "../entities/Users";

export const authChecker: AuthChecker<Context> = async ({ context }, roles) => {
  const { req } = context;

  if (!req.authId) {
    console.error("No req.authId");
    return false;
  }

  const user = await Users.findOne(req.authId);
  if (!user) {
    console.error("No user");
    return false;
  }
  return true;
};
