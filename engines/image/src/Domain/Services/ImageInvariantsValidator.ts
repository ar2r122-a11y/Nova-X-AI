export class ImageInvariantsValidator {
    static validatePrompt(prompt: string): void {
        if (!prompt || prompt.trim().length === 0) {
            throw new Error("Prompt cannot be empty.");
        }
        if (prompt.length > 10000) {
            throw new Error("Prompt exceeds maximum length of 10000 characters.");
        }
    }

    static validateNegativePrompt(negativePrompt: string): void {
        if (negativePrompt.length > 5000) {
            throw new Error("Negative prompt exceeds maximum length of 5000 characters.");
        }
    }

    static validateCandidateCount(count: number, max: number): void {
        if (count < 1) {
            throw new Error("Candidate count must be at least 1.");
        }
        if (count > max) {
            throw new Error(`Candidate count exceeds maximum of ${max}.`);
        }
    }

    static validateDimensions(width: number, height: number): void {
        if (width < 64 || height < 64) {
            throw new Error("Image dimensions must be at least 64x64.");
        }
        if (width > 8192 || height > 8192) {
            throw new Error("Image dimensions exceed maximum of 8192x8192.");
        }
    }

    static validateProviderAvailability(providerId: string, available: boolean): void {
        if (!providerId || providerId.trim().length === 0) {
            throw new Error("ProviderId cannot be empty.");
        }
        if (!available) {
            throw new Error(`Provider ${providerId} is not available.`);
        }
    }
}
