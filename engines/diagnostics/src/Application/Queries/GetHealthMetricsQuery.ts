import { IQuery } from "@nova-x-ai/core";

export interface GetHealthMetricsQuery extends IQuery {
    readonly engineName?: string;
}
