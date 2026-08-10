export class RelationshipMetrics {
    private constructor(
        public readonly trust: number,
        public readonly affinity: number,
        public readonly respect: number,
        public readonly loyalty: number
    ) {}

    static create(trust: number, affinity: number, respect: number, loyalty: number): RelationshipMetrics {
        const clampedTrust = Math.max(0.0, Math.min(1.0, trust));
        const clampedRespect = Math.max(0.0, Math.min(1.0, respect));
        const clampedLoyalty = Math.max(0.0, Math.min(1.0, loyalty));
        const clampedAffinity = Math.max(-1.0, Math.min(1.0, affinity));

        return new RelationshipMetrics(clampedTrust, clampedAffinity, clampedRespect, clampedLoyalty);
    }

    static baseline(): RelationshipMetrics {
        return new RelationshipMetrics(0.5, 0.0, 0.5, 0.5);
    }

    withTrust(trust: number): RelationshipMetrics {
        return RelationshipMetrics.create(trust, this.affinity, this.respect, this.loyalty);
    }

    withAffinity(affinity: number): RelationshipMetrics {
        return RelationshipMetrics.create(this.trust, affinity, this.respect, this.loyalty);
    }

    withRespect(respect: number): RelationshipMetrics {
        return RelationshipMetrics.create(this.trust, this.affinity, respect, this.loyalty);
    }

    withLoyalty(loyalty: number): RelationshipMetrics {
        return RelationshipMetrics.create(this.trust, this.affinity, this.respect, loyalty);
    }

    toJSON() {
        return {
            trust: this.trust,
            affinity: this.affinity,
            respect: this.respect,
            loyalty: this.loyalty
        };
    }
}
