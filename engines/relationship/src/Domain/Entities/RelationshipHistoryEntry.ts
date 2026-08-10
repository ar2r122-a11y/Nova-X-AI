export class RelationshipHistoryEntry {
    private constructor(
        public readonly entryId: string,
        public readonly timestamp: number,
        public readonly previousMetrics: { trust: number; affinity: number; respect: number; loyalty: number },
        public readonly newMetrics: { trust: number; affinity: number; respect: number; loyalty: number },
        public readonly previousStatus: string,
        public readonly newStatus: string,
        public readonly trigger: string,
        public readonly sourceEntityId: string
    ) {}

    static create(
        previousMetrics: { trust: number; affinity: number; respect: number; loyalty: number },
        newMetrics: { trust: number; affinity: number; respect: number; loyalty: number },
        previousStatus: string,
        newStatus: string,
        trigger: string,
        sourceEntityId: string
    ): RelationshipHistoryEntry {
        return new RelationshipHistoryEntry(
            `hist-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            Date.now(),
            previousMetrics,
            newMetrics,
            previousStatus,
            newStatus,
            trigger,
            sourceEntityId
        );
    }

    toJSON() {
        return {
            entryId: this.entryId,
            timestamp: this.timestamp,
            previousMetrics: this.previousMetrics,
            newMetrics: this.newMetrics,
            previousStatus: this.previousStatus,
            newStatus: this.newStatus,
            trigger: this.trigger,
            sourceEntityId: this.sourceEntityId
        };
    }
}
