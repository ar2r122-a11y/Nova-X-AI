import { IQuery } from "@nova-x-ai/core";

export class GetProviderHealthQuery implements IQuery {
    constructor(
        public readonly providerId: string,
        public readonly requesterId?: string
    ) {}
}
