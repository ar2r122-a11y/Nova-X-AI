import { describe, it, expect } from "vitest";
import { GenerateImageValidator, SelectCandidateValidator, DeleteImageValidator } from "../../src/Application/Validators/ImageValidators";

describe("Validators", () => {
    describe("GenerateImageValidator", () => {
        it("should reject empty sessionId", () => {
            expect(() => GenerateImageValidator.validate({
                sessionId: "",
                ownerId: "owner",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1",
                width: 512,
                height: 512,
                candidateCount: 1,
                claims: { roles: ["user"], permissions: ["write"] }
            })).toThrow("SessionId is required.");
        });

        it("should reject empty ownerId", () => {
            expect(() => GenerateImageValidator.validate({
                sessionId: "ses-1",
                ownerId: "",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1",
                width: 512,
                height: 512,
                candidateCount: 1,
                claims: { roles: ["user"], permissions: ["write"] }
            })).toThrow("OwnerId is required.");
        });

        it("should reject empty roles", () => {
            expect(() => GenerateImageValidator.validate({
                sessionId: "ses-1",
                ownerId: "owner",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1",
                width: 512,
                height: 512,
                candidateCount: 1,
                claims: { roles: [], permissions: ["write"] }
            })).toThrow("Unauthenticated");
        });

        it("should reject invalid prompt", () => {
            expect(() => GenerateImageValidator.validate({
                sessionId: "ses-1",
                ownerId: "owner",
                prompt: "",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1",
                width: 512,
                height: 512,
                candidateCount: 1,
                claims: { roles: ["user"], permissions: ["write"] }
            })).toThrow("Prompt cannot be empty.");
        });

        it("should reject too long prompt", () => {
            expect(() => GenerateImageValidator.validate({
                sessionId: "ses-1",
                ownerId: "owner",
                prompt: "a".repeat(10001),
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1",
                width: 512,
                height: 512,
                candidateCount: 1,
                claims: { roles: ["user"], permissions: ["write"] }
            })).toThrow("Prompt exceeds maximum length");
        });

        it("should reject too long negative prompt", () => {
            expect(() => GenerateImageValidator.validate({
                sessionId: "ses-1",
                ownerId: "owner",
                prompt: "test",
                negativePrompt: "a".repeat(5001),
                mode: "textToImage",
                aspectRatio: "1:1",
                width: 512,
                height: 512,
                candidateCount: 1,
                claims: { roles: ["user"], permissions: ["write"] }
            })).toThrow("Negative prompt exceeds maximum length");
        });

        it("should reject invalid dimensions", () => {
            expect(() => GenerateImageValidator.validate({
                sessionId: "ses-1",
                ownerId: "owner",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1",
                width: 32,
                height: 32,
                candidateCount: 1,
                claims: { roles: ["user"], permissions: ["write"] }
            })).toThrow("Image dimensions must be at least 64x64");
        });

        it("should reject candidate count over max", () => {
            expect(() => GenerateImageValidator.validate({
                sessionId: "ses-1",
                ownerId: "owner",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1",
                width: 512,
                height: 512,
                candidateCount: 9,
                claims: { roles: ["user"], permissions: ["write"] }
            })).toThrow("Candidate count exceeds maximum");
        });

        it("should pass valid input", () => {
            expect(() => GenerateImageValidator.validate({
                sessionId: "ses-1",
                ownerId: "owner",
                prompt: "test",
                negativePrompt: "blurry",
                mode: "textToImage",
                aspectRatio: "1:1",
                width: 512,
                height: 512,
                candidateCount: 4,
                claims: { roles: ["user"], permissions: ["write"] }
            })).not.toThrow();
        });
    });

    describe("SelectCandidateValidator", () => {
        it("should reject empty imageId", () => {
            expect(() => SelectCandidateValidator.validate({
                imageId: "",
                candidateId: "cnd-1",
                requesterId: "user",
                claims: { roles: ["user"], permissions: ["write"] }
            })).toThrow("Image not found");
        });

        it("should reject empty candidateId", () => {
            expect(() => SelectCandidateValidator.validate({
                imageId: "img-1",
                candidateId: "",
                requesterId: "user",
                claims: { roles: ["user"], permissions: ["write"] }
            })).toThrow("CandidateId is required.");
        });

        it("should reject empty roles", () => {
            expect(() => SelectCandidateValidator.validate({
                imageId: "img-1",
                candidateId: "cnd-1",
                requesterId: "user",
                claims: { roles: [], permissions: ["write"] }
            })).toThrow("Unauthenticated");
        });

        it("should pass valid input", () => {
            expect(() => SelectCandidateValidator.validate({
                imageId: "img-1",
                candidateId: "cnd-1",
                requesterId: "user",
                claims: { roles: ["user"], permissions: ["write"] }
            })).not.toThrow();
        });
    });

    describe("DeleteImageValidator", () => {
        it("should reject empty imageId", () => {
            expect(() => DeleteImageValidator.validate({
                imageId: "",
                requesterId: "user",
                claims: { roles: ["user"], permissions: ["write"] }
            })).toThrow("Image not found");
        });

        it("should reject empty roles", () => {
            expect(() => DeleteImageValidator.validate({
                imageId: "img-1",
                requesterId: "user",
                claims: { roles: [], permissions: ["write"] }
            })).toThrow("Unauthenticated");
        });

        it("should pass valid input", () => {
            expect(() => DeleteImageValidator.validate({
                imageId: "img-1",
                requesterId: "user",
                claims: { roles: ["user"], permissions: ["write"] }
            })).not.toThrow();
        });
    });
});
