import { IQuery } from "@nova-x-ai/core";

export class GetAudioCacheQuery implements IQuery {
    constructor(
        public readonly voiceId: string,
        public readonly requesterId?: string
    ) {}
}
