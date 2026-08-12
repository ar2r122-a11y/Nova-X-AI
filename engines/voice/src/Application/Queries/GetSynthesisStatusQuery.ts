import { IQuery } from "@nova-x-ai/core";

export class GetSynthesisStatusQuery implements IQuery {
    constructor(
        public readonly voiceId: string,
        public readonly requestId: string,
        public readonly requesterId?: string
    ) {}
}
