import type { IQueryHandler } from "@nova-x-ai/core";
import type { IStorageEngine } from "../../Contracts";
import { GetDeltaLogQuery } from "../Queries";

export class GetDeltaLogHandler implements IQueryHandler<GetDeltaLogQuery, any> {
    constructor(private readonly storage: IStorageEngine) {}

    async handle(query: GetDeltaLogQuery): Promise<any> {
        const deltaLog = this.storage.getDeltaLog();
        const deltas = await deltaLog.getDeltas(query.streamId);
        const sliced = deltas.slice(-query.limit);

        const hasConflicts = sliced.some(d => {
            const entries = d.clock.getEntries();
            return entries.length > 1;
        });

        return {
            streamId: query.streamId,
            deltaCount: sliced.length,
            latestDeltaTimestamp: sliced.length > 0 ? sliced[sliced.length - 1].timestamp : 0,
            hasConflicts
        };
    }
}
