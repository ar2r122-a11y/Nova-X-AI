import { IQuery } from "@nova-x-ai/core";

export interface ListAnomaliesQuery extends IQuery {
    readonly engineName?: string;
    readonly resolved?: boolean;
}
