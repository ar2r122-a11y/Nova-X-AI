import { IQuery } from "./IQuery";

export interface IQueryHandler<
    TQuery extends IQuery,
    TResult
> {

    handle(
        query: TQuery
    ): Promise<TResult>;

}