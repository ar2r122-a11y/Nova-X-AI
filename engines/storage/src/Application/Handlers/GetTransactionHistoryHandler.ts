import type { IQueryHandler } from "@nova-x-ai/core";
import type { IStorageEngine } from "../../Contracts";
import { GetTransactionHistoryQuery } from "../Queries";

export class GetTransactionHistoryHandler implements IQueryHandler<GetTransactionHistoryQuery, any[]> {
    constructor(private readonly storage: IStorageEngine) {}

    async handle(query: GetTransactionHistoryQuery): Promise<any[]> {
        const wal = this.storage.getWAL();
        const entries = await wal.readEntries(0);
        return entries.slice(-query.limit);
    }
}
