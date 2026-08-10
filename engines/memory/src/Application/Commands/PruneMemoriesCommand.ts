import { ICommand } from "@nova-x-ai/core";
import type { PruneMemoriesCommand as IPruneMemoriesCommand } from "../../Contracts/IMemoryEngine";

export class PruneMemoriesCommand implements ICommand, IPruneMemoriesCommand {
    constructor(
        public readonly ownerId: string,
        public readonly minSalience: number,
        public readonly maxAgeMs: number,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
