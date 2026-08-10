import type { IQueryHandler } from "@nova-x-ai/core";
import type { IStorageEngine } from "../../Contracts";
import { GetQuotaStatusQuery } from "../Queries";

export class GetQuotaStatusHandler implements IQueryHandler<GetQuotaStatusQuery, any> {
    constructor(private readonly storage: IStorageEngine) {}

    async handle(_query: GetQuotaStatusQuery): Promise<any> {
        const quota = await this.storage.getQuotaUsage();
        const percentage = quota.limitBytes > 0 ? (quota.totalBytes / quota.limitBytes) * 100 : 0;

        return {
            totalBytes: quota.totalBytes,
            limitBytes: quota.limitBytes,
            usagePercentage: percentage,
            isNearLimit: percentage >= 85,
            isExceeded: percentage >= 100
        };
    }
}
