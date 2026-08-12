import { IQuery } from "@nova-x-ai/core";

export class GetImageQuery implements IQuery {
    constructor(
        public readonly imageId: string,
        public readonly requesterId?: string
    ) {}
}
