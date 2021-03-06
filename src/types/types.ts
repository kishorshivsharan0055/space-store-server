import { Field, Float, Int, ObjectType } from "type-graphql";
import { Request, Response } from "express";
import { ExecutionParams } from "subscriptions-transport-ws";

export interface ExtendedRequest extends Request {
  authToken: string | null;
  authId: string | null;
}
export type Context = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: ExtendedRequest;
  res: Response;
  connection: ExecutionParams<{
    authId: string | null;
  }>;
};

@ObjectType()
export class CustomError {
  @Field()
  code: string;

  @Field()
  message: string;
}
