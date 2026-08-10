import { ICommand } from "@nova-x-ai/core";

export class ExecuteRelationshipDecayCommand implements ICommand {
    constructor(
        public readonly relationshipId: string,
        public readonly deltaTimeMs: number
    ) {}
}
