import { ICommand } from "@nova-x-ai/core";

export class InitializeWorldCommand implements ICommand {
    constructor(
        public readonly worldId: string,
        public readonly name: string,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
