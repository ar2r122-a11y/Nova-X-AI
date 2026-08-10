import { IQuery } from "@nova-x-ai/core";
import type { GetMemoriesByTypeQuery as IGetMemoriesByTypeQuery } from "../../Contracts/IMemoryEngine";

export class GetMemoriesByTypeQuery implements IQuery, IGetMemoriesByTypeQuery {
    constructor(
        public readonly ownerId: string,
        public readonly memoryType: string,
        public readonly requesterId: string,
        public readonly limit: number
    ) {}
}
