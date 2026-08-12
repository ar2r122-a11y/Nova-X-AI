import { ImageCandidate } from "../../Domain/Entities/ImageCandidate";

export class CandidateDto {
    constructor(
        public readonly candidateId: string,
        public readonly imageId: string,
        public readonly uri: string,
        public readonly prompt: string,
        public readonly negativePrompt: string,
        public readonly width: number,
        public readonly height: number,
        public readonly seed: number | null,
        public readonly score: number,
        public readonly isSelected: boolean,
        public readonly metadata: Record<string, unknown>,
        public readonly createdAt: number
    ) {}

    static fromEntity(candidate: ImageCandidate): CandidateDto {
        const candidateId = typeof candidate.candidateId === "string" ? candidate.candidateId : (candidate.candidateId as { getValue?: () => string }).getValue?.() ?? String(candidate.candidateId);
        return new CandidateDto(
            candidateId,
            candidate.imageId,
            candidate.uri,
            typeof candidate.prompt === "string" ? candidate.prompt : candidate.prompt.getCompiledPrompt(),
            candidate.negativePrompt,
            candidate.width,
            candidate.height,
            candidate.seed,
            candidate.score,
            candidate.isSelected,
            candidate.metadata,
            candidate.createdAt
        );
    }
}
