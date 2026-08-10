export class MilestoneDescriptor {
    private constructor(
        public readonly milestoneId: string,
        public readonly name: string,
        public readonly description: string,
        public readonly requiredTrust: number,
        public readonly requiredAffinity: number,
        public readonly requiredRespect: number,
        public readonly requiredLoyalty: number,
        public readonly requiredBondType: string,
        public readonly unlockedAt?: number
    ) {}

    static create(
        milestoneId: string,
        name: string,
        description: string,
        requiredTrust: number,
        requiredAffinity: number,
        requiredRespect: number,
        requiredLoyalty: number,
        requiredBondType: string
    ): MilestoneDescriptor {
        return new MilestoneDescriptor(
            milestoneId,
            name,
            description,
            Math.max(0.0, Math.min(1.0, requiredTrust)),
            Math.max(-1.0, Math.min(1.0, requiredAffinity)),
            Math.max(0.0, Math.min(1.0, requiredRespect)),
            Math.max(0.0, Math.min(1.0, requiredLoyalty)),
            requiredBondType
        );
    }

    unlock(timestamp: number): MilestoneDescriptor {
        return new MilestoneDescriptor(
            this.milestoneId,
            this.name,
            this.description,
            this.requiredTrust,
            this.requiredAffinity,
            this.requiredRespect,
            this.requiredLoyalty,
            this.requiredBondType,
            timestamp
        );
    }

    isUnlocked(): boolean {
        return this.unlockedAt !== undefined;
    }

    toJSON() {
        return {
            milestoneId: this.milestoneId,
            name: this.name,
            description: this.description,
            requiredTrust: this.requiredTrust,
            requiredAffinity: this.requiredAffinity,
            requiredRespect: this.requiredRespect,
            requiredLoyalty: this.requiredLoyalty,
            requiredBondType: this.requiredBondType,
            unlockedAt: this.unlockedAt
        };
    }
}
