
export class IsActiveRelationshipSpecification {
    static isSatisfiedBy(status: string): boolean {
        return status === "active" || status === "strained" || status === "dormant";
    }

    static canProcessInteraction(status: string): boolean {
        return status !== "severed";
    }

    static canDecay(status: string): boolean {
        return status !== "severed";
    }

    static canReceiveEvents(status: string): boolean {
        return status !== "severed";
    }
}
