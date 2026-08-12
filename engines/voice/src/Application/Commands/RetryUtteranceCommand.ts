import { ICommand } from "@nova-x-ai/core";

export class RetryUtteranceCommand implements ICommand {
    constructor(
        public readonly voiceId: string,
        public readonly requestId: string,
        public readonly correlationId: string = `retry-${Date.now()}`,
        public readonly causationId: string = "",
        public readonly claims: { roles: string[]; permissions: string[] } = { roles: [], permissions: [] }
    ) {}
}
