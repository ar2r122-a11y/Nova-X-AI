import { ICommand } from "@nova-x-ai/core";

export class RecallMemoryCommand implements ICommand {
    constructor(
        public readonly ownerId: string,
        public readonly queryText: string,
        public readonly limit: number,
        public readonly memoryTypes: string[],
        public readonly requesterId: string
    ) {}
}
