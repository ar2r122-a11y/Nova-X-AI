export class ImageProjection {
    static projectSummary(aggregate: {
        getId(): { getValue(): string };
        getSessionId(): { getValue(): string };
        getOwnerId(): string;
        getMode(): string;
        getStatus(): string;
        getSelectedCandidateId(): string | null;
        getCandidates(): unknown[];
        getCreatedAt(): number;
        getAspectRatio(): string;
    }): {
        imageId: string;
        sessionId: string;
        ownerId: string;
        mode: string;
        status: string;
        selectedCandidateId: string | null;
        candidateCount: number;
        createdAt: number;
        aspectRatio: string;
    } {
        return {
            imageId: aggregate.getId().getValue(),
            sessionId: aggregate.getSessionId().getValue(),
            ownerId: aggregate.getOwnerId(),
            mode: aggregate.getMode(),
            status: aggregate.getStatus(),
            selectedCandidateId: aggregate.getSelectedCandidateId(),
            candidateCount: aggregate.getCandidates().length,
            createdAt: aggregate.getCreatedAt(),
            aspectRatio: aggregate.getAspectRatio()
        };
    }
}
