import { IQuery } from "@nova-x-ai/core";
import type { GetMemoryQuery as IGetMemoryQuery } from "../../Contracts/IMemoryEngine";

export class GetMemoryQuery implements IQuery, IGetMemoryQuery {
    constructor(
        public readonly memoryId: string,
        public readonly requesterId: string
    ) {}
}
