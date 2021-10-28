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

export interface PriceResponse {
	symbol: string;
	priceChange: string;
	priceChangePercent: string;
	weightedAvgPrice: string;
	prevClosePrice: string;
	lastPrice: string;
	lastQty: string;
	bidPrice: string;
	bidQty: string;
	askPrice: string;
	askQty: string;
	openPrice: string;
	highPrice: string;
	lowPrice: string;
	volume: string;
	quoteVolume: string;
	openTime: number;
	closeTime: number;
	firstId: number;
	lastId: number;
	count: number;
}

export interface PriceResponseExtended extends PriceResponse {
	name: string | undefined;
}

@ObjectType()
export class Prize {
	@Field(() => Int)
	min!: number;

	@Field(() => Int)
	max!: number;

	@Field(() => Float)
	amount!: number;
}
