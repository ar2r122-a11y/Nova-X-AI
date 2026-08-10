import { ICommand } from "@nova-x-ai/core";

export class SetGlobalVariableCommand implements ICommand {
    constructor(
        public readonly worldId: string,
        public readonly key: string,
        public readonly value: unknown,
        public readonly type: string,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
