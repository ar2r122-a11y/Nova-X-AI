import { IQuery } from "@nova-x-ai/core";
import type { GetAnalyticsSettingsQuery as IGetAnalyticsSettingsQuery } from "../../Contracts/IAnalyticsEngine";

export class GetAnalyticsSettingsQuery implements IQuery, IGetAnalyticsSettingsQuery {
    constructor(public readonly requesterId: string = "anonymous") {}
}
