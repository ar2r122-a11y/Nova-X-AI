
export class RelationshipMetric {
    public readonly targetId: string;
    public readonly trust: number;
    public readonly affection: number;
    public readonly familiarity: number;

    private constructor(targetId: string, trust: number, affection: number, familiarity: number) {
        this.targetId = targetId;
        this.trust = trust;
        this.affection = affection;
        this.familiarity = familiarity;
    }

    public static create(targetId: string, trust: number, affection: number, familiarity: number): RelationshipMetric {
        if (!targetId || targetId.trim().length === 0) {
            throw new Error("TargetId cannot be empty.");
        }
        const validateMetric = (name: string, value: number) => {
            if (value < -1.0 || value > 1.0) {
                throw new Error(`${name} must be between -1.0 and 1.0.`);
            }
        };
        validateMetric("trust", trust);
        validateMetric("affection", affection);
        validateMetric("familiarity", familiarity);
        return new RelationshipMetric(targetId, trust, affection, familiarity);
    }

    public static fromObject(data: { targetId: string; trust: number; affection: number; familiarity: number }): RelationshipMetric {
        return RelationshipMetric.create(data.targetId, data.trust, data.affection, data.familiarity);
    }

    public getValue(): { targetId: string; trust: number; affection: number; familiarity: number } {
        return { targetId: this.targetId, trust: this.trust, affection: this.affection, familiarity: this.familiarity };
    }

    public equals(other: RelationshipMetric): boolean {
        return this.targetId === other.targetId && this.trust === other.trust && this.affection === other.affection && this.familiarity === other.familiarity;
    }
}
