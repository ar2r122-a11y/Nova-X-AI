import { ICommand } from "@nova-x-ai/core";

export class AdvanceTimeCommand implements ICommand {
    constructor(
        public readonly worldId: string,
        public readonly secondsToAdvance: number,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
