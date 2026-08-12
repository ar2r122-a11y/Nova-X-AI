import { IQuery } from "@nova-x-ai/core";

export class GetAudioStreamQuery implements IQuery {
    constructor(
        public readonly streamId: string,
        public readonly requesterId?: string
    ) {}
}
