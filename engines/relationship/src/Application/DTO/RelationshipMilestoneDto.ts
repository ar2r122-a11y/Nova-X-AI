export class RelationshipMilestoneDto {
    constructor(
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

    static fromDescriptor(descriptor: import("../../Domain/ValueObjects/MilestoneDescriptor").MilestoneDescriptor): RelationshipMilestoneDto {
        return new RelationshipMilestoneDto(
            descriptor.milestoneId,
            descriptor.name,
            descriptor.description,
            descriptor.requiredTrust,
            descriptor.requiredAffinity,
            descriptor.requiredRespect,
            descriptor.requiredLoyalty,
            descriptor.requiredBondType,
            descriptor.unlockedAt
        );
    }
}
