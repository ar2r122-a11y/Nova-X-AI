import { ICommand } from "@nova-x-ai/core";

export class TransitionRegionCommand implements ICommand {
    constructor(
        public readonly worldId: string,
        public readonly regionId: string,
        public readonly targetState: string,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
