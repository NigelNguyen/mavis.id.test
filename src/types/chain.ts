import type { ExactPartial, FeeValuesLegacy, Index, OneOf, Quantity, RpcTransactionRequest, TransactionRequest, TransactionRequestBase } from 'viem'

type TransactionRequestEIP2718<
	TQuantity = bigint,
	TIndex = number,
	TTransactionType = 'eip2718',
> = TransactionRequestBase<TQuantity, TIndex> &
ExactPartial<FeeValuesLegacy<TQuantity>> & {
	accessList?: never | undefined
	blobs?: undefined
	type?: TTransactionType | undefined
}

export type RoninTransactionRequest<TQuantity = bigint, TIndex = number> = OneOf<
	| TransactionRequest<TQuantity, TIndex>
	| TransactionRequestEIP2718<TQuantity, TIndex>
>
export type RoninRpcTransactionRequest = OneOf<
	RpcTransactionRequest | TransactionRequestEIP2718<Quantity, Index, '0x64'>
>
