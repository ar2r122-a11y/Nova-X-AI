import { IQuery } from "./IQuery";
import { IQueryDispatcher } from "./IQueryDispatcher";
import { IQueryHandler } from "./IQueryHandler";

export class QueryDispatcher
implements IQueryDispatcher {

    private readonly handlers =
        new Map<
            string,
            IQueryHandler<any, any>
        >();

    public register<
        TQuery extends IQuery,
        TResult
    >(
        queryType: string,
        handler: IQueryHandler<TQuery, TResult>
    ): void {

        this.handlers.set(
            queryType,
            handler
        );

    }

    public async dispatch<
        TQuery extends IQuery,
        TResult
    >(
        query: TQuery
    ): Promise<TResult> {

        const handler =
            this.handlers.get(
                query.constructor.name
            );

        if (!handler) {

            throw new Error(
                `Query handler '${query.constructor.name}' is not registered.`
            );

        }

        return handler.handle(
            query
        );

    }

}