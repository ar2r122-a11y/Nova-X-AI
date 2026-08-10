import { IQuery } from "@nova-x-ai/core";

export class GetSocialGraphQuery implements IQuery {
    constructor(
        public readonly entityId: string,
        public readonly requesterId: string
    ) {}
}
