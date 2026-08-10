export class InteractionLedgerEntry {
    private constructor(
        public readonly entryId: string,
        public readonly timestamp: number,
        public readonly sourceEntityId: string,
        public readonly targetEntityId: string,
        public readonly interactionType: string,
        public readonly emotionalValence: number,
        public readonly trustDelta: number,
        public readonly affinityDelta: number,
        public readonly respectDelta: number,
        public readonly loyaltyDelta: number,
        public readonly contextTags: string[],
        public readonly sharedMemoryIds: string[]
    ) {}

    static create(
        sourceEntityId: string,
        targetEntityId: string,
        interactionType: string,
        emotionalValence: number,
        trustDelta: number,
        affinityDelta: number,
        respectDelta: number,
        loyaltyDelta: number,
        contextTags: string[],
        sharedMemoryIds: string[]
    ): InteractionLedgerEntry {
        return new InteractionLedgerEntry(
            `${sourceEntityId}-${targetEntityId}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            Date.now(),
            sourceEntityId,
            targetEntityId,
            interactionType,
            emotionalValence,
            trustDelta,
            affinityDelta,
            respectDelta,
            loyaltyDelta,
            contextTags,
            sharedMemoryIds
        );
    }

    toJSON() {
        return {
            entryId: this.entryId,
            timestamp: this.timestamp,
            sourceEntityId: this.sourceEntityId,
            targetEntityId: this.targetEntityId,
            interactionType: this.interactionType,
            emotionalValence: this.emotionalValence,
            trustDelta: this.trustDelta,
            affinityDelta: this.affinityDelta,
            respectDelta: this.respectDelta,
            loyaltyDelta: this.loyaltyDelta,
            contextTags: this.contextTags,
            sharedMemoryIds: this.sharedMemoryIds
        };
    }
}
