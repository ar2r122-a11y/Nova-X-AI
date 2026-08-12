import { ImageNotFoundException } from "../../Domain/Exceptions/ImageExceptions";
import { ImageInvariantsValidator } from "../../Domain/Services/ImageInvariantsValidator";

export class GenerateImageValidator {
    static validate(command: {
        sessionId: string;
        ownerId: string;
        prompt: string;
        negativePrompt: string;
        mode: string;
        aspectRatio: string;
        width: number;
        height: number;
        candidateCount: number;
        claims: { roles: string[]; permissions: string[] };
    }): void {
        if (!command.sessionId || command.sessionId.trim().length === 0) {
            throw new Error("SessionId is required.");
        }
        if (!command.ownerId || command.ownerId.trim().length === 0) {
            throw new Error("OwnerId is required.");
        }
        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }
        ImageInvariantsValidator.validatePrompt(command.prompt);
        ImageInvariantsValidator.validateNegativePrompt(command.negativePrompt);
        ImageInvariantsValidator.validateDimensions(command.width, command.height);
        ImageInvariantsValidator.validateCandidateCount(command.candidateCount, 8);
    }
}

export class SelectCandidateValidator {
    static validate(command: {
        imageId: string;
        candidateId: string;
        requesterId: string;
        claims: { roles: string[]; permissions: string[] };
    }): void {
        if (!command.imageId || command.imageId.trim().length === 0) {
            throw new ImageNotFoundException(command.imageId);
        }
        if (!command.candidateId || command.candidateId.trim().length === 0) {
            throw new Error("CandidateId is required.");
        }
        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }
    }
}

export class DeleteImageValidator {
    static validate(command: {
        imageId: string;
        requesterId: string;
        claims: { roles: string[]; permissions: string[] };
    }): void {
        if (!command.imageId || command.imageId.trim().length === 0) {
            throw new ImageNotFoundException(command.imageId);
        }
        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }
    }
}
