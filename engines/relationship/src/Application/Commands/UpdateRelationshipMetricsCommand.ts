import { ICommand } from "@nova-x-ai/core";

export class UpdateRelationshipMetricsCommand implements ICommand {
    constructor(
        public readonly relationshipId: string,
        public readonly trustDelta: number,
        public readonly affinityDelta: number,
        public readonly respectDelta: number,
        public readonly loyaltyDelta: number,
        public readonly interactionType: string,
        public readonly emotionalValence: number,
        public readonly contextTags: string[],
        public readonly sharedMemoryIds: string[]
    ) {}
}
