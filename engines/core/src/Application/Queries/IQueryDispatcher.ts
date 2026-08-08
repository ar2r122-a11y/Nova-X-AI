import { IQuery } from "./IQuery";

export interface IQueryDispatcher {

    dispatch<
        TQuery extends IQuery,
        TResult
    >(
        query: TQuery
    ): Promise<TResult>;

}