import { ICommand } from "@nova-x-ai/core";
import type { ConsolidateMemoriesCommand as IConsolidateMemoriesCommand } from "../../Contracts/IMemoryEngine";

export class ConsolidateMemoriesCommand implements ICommand, IConsolidateMemoriesCommand {
    constructor(
        public readonly ownerId: string,
        public readonly memoryIds: string[],
        public readonly clusterId?: string,
        public readonly claims: { roles: string[]; permissions: string[] } = { roles: [], permissions: [] }
    ) {}
}
