export class MemoryClusterDto {
    constructor(
        public readonly clusterId: string,
        public readonly memberMemoryIds: string[],
        public readonly memberCount: number,
        public readonly createdAt: number,
        public readonly updatedAt: number
    ) {}
}
