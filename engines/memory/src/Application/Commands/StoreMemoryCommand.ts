import { ICommand } from "@nova-x-ai/core";
import type { StoreMemoryCommand as IStoreMemoryCommand } from "../../Contracts/IMemoryEngine";

export class StoreMemoryCommand implements ICommand, IStoreMemoryCommand {
    constructor(
        public readonly content: string,
        public readonly memoryType: string,
        public readonly ownerId: string,
        public readonly salience: number,
        public readonly tags: string[],
        public readonly claims: { roles: string[]; permissions: string[] },
        public readonly sourceEventId?: string,
        public readonly clusterId?: string,
        public readonly vector?: number[]
    ) {}
}
