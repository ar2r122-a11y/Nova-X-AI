import { describe, it, expect } from "vitest";
import { ImageQuotaPolicy } from "../../src/Domain/Policies/ImageQuotaPolicy";
import { RetryPolicy } from "../../src/Domain/Policies/RetryPolicy";
import { StreamingPolicy } from "../../src/Domain/Policies/StreamingPolicy";
import { WatermarkPolicy } from "../../src/Domain/Policies/WatermarkPolicy";
import { ImageRetentionPolicy } from "../../src/Domain/Policies/ImageRetentionPolicy";
import { SafetyContentModerationPolicy } from "../../src/Domain/Policies/SafetyContentModerationPolicy";
import { ResourceBudgetPolicy } from "../../src/Domain/Policies/ResourceBudgetPolicy";
import { ProviderFailoverPolicy } from "../../src/Domain/Policies/ProviderFailoverPolicy";
import { CandidateGenerationPolicy } from "../../src/Domain/Policies/CandidateGenerationPolicy";
import { ContentSafetyRating } from "../../src/Domain/ValueObjects/ContentSafetyRating";
import { ResourceBudget } from "../../src/Domain/ValueObjects/ResourceBudget";
import { ImageDimensions } from "../../src/Domain/ValueObjects/ImageDimensions";
import { SafetyViolationException } from "../../src/Domain/Exceptions/ImageExceptions";
import { ImageFormat } from "../../src/Domain/ValueObjects/ImageFormat";

describe("Policies", () => {
    describe("ImageQuotaPolicy", () => {
        it("should allow creation under quota", () => {
            const policy = new ImageQuotaPolicy(10, 3);
            expect(policy.canCreateImage("user-1", 5, 1)).toBe(true);
        });

        it("should deny when quota exceeded", () => {
            const policy = new ImageQuotaPolicy(10, 3);
            expect(policy.canCreateImage("user-1", 10, 1)).toBe(false);
        });

        it("should deny when concurrent generations exceeded", () => {
            const policy = new ImageQuotaPolicy(10, 3);
            expect(policy.canCreateImage("user-1", 5, 3)).toBe(false);
        });

        it("should return configured limits", () => {
            const policy = new ImageQuotaPolicy(100, 10);
            expect(policy.getMaxImagesPerUser()).toBe(100);
            expect(policy.getMaxConcurrentGenerations()).toBe(10);
        });
    });

    describe("RetryPolicy", () => {
        it("should allow retry within limit", () => {
            const policy = new RetryPolicy(3, 1000);
            expect(policy.shouldRetry(0)).toBe(true);
            expect(policy.shouldRetry(1)).toBe(true);
            expect(policy.shouldRetry(2)).toBe(true);
        });

        it("should deny retry beyond limit", () => {
            const policy = new RetryPolicy(3, 1000);
            expect(policy.shouldRetry(3)).toBe(false);
            expect(policy.shouldRetry(10)).toBe(false);
        });

        it("should calculate exponential backoff", () => {
            const policy = new RetryPolicy(3, 1000);
            expect(policy.getDelay(0)).toBe(1000);
            expect(policy.getDelay(1)).toBe(2000);
            expect(policy.getDelay(2)).toBe(4000);
        });
    });

    describe("StreamingPolicy", () => {
        it("should allow streaming under limit", () => {
            const policy = new StreamingPolicy(65536, 10);
            expect(policy.canStream(5)).toBe(true);
        });

        it("should deny streaming over limit", () => {
            const policy = new StreamingPolicy(65536, 10);
            expect(policy.canStream(10)).toBe(false);
        });

        it("should return configured values", () => {
            const policy = new StreamingPolicy(32768, 5);
            expect(policy.getMaxChunkSize()).toBe(32768);
            expect(policy.getMaxConcurrentStreams()).toBe(5);
        });
    });

    describe("WatermarkPolicy", () => {
        it("should require watermark for specific formats", () => {
            const policy = new WatermarkPolicy([ImageFormat.PNG, ImageFormat.JPEG]);
            expect(policy.requiresWatermark(ImageFormat.PNG)).toBe(true);
            expect(policy.requiresWatermark(ImageFormat.WEBP)).toBe(false);
        });

        it("should return required formats", () => {
            const policy = new WatermarkPolicy([ImageFormat.PNG]);
            expect(policy.getRequiredFormats()).toEqual([ImageFormat.PNG]);
        });
    });

    describe("ImageRetentionPolicy", () => {
        it("should identify expired assets", () => {
            const policy = new ImageRetentionPolicy(30);
            const thirtyOneDaysAgo = Date.now() - (31 * 24 * 60 * 60 * 1000);
            expect(policy.isExpired(thirtyOneDaysAgo)).toBe(true);
        });

        it("should identify fresh assets", () => {
            const policy = new ImageRetentionPolicy(30);
            const yesterday = Date.now() - (1 * 24 * 60 * 60 * 1000);
            expect(policy.isExpired(yesterday)).toBe(false);
        });

        it("should return retention days", () => {
            const policy = new ImageRetentionPolicy(60);
            expect(policy.getRetentionDays()).toBe(60);
        });
    });

    describe("SafetyContentModerationPolicy", () => {
        it("should allow safe content", () => {
            const policy = new SafetyContentModerationPolicy(["nsfw", "gore"]);
            expect(policy.moderate(ContentSafetyRating.SAFE, ["cat", "nature"])).toBe(true);
        });

        it("should reject explicit content", () => {
            const policy = new SafetyContentModerationPolicy(["nsfw", "gore"]);
            expect(() => policy.moderate(ContentSafetyRating.UNSAFE, [])).toThrow(SafetyViolationException);
        });

        it("should reject blocked tags", () => {
            const policy = new SafetyContentModerationPolicy(["nsfw", "gore"]);
            expect(() => policy.moderate(ContentSafetyRating.SAFE, ["nsfw"])).toThrow(SafetyViolationException);
            expect(() => policy.moderate(ContentSafetyRating.SAFE, ["gore"])).toThrow(SafetyViolationException);
        });

        it("should allow suggestive content without blocked tags", () => {
            const policy = new SafetyContentModerationPolicy(["nsfw"]);
            expect(policy.moderate(ContentSafetyRating.QUESTIONABLE, ["art"])).toBe(true);
        });
    });

    describe("ResourceBudgetPolicy", () => {
        it("should allow when budget available", () => {
            const policy = new ResourceBudgetPolicy();
            const budget = ResourceBudget.create(1000, 2000, 5000, 1024);
            expect(() => policy.enforce(budget)).not.toThrow();
        });

        it("should throw when budget exhausted", () => {
            const policy = new ResourceBudgetPolicy();
            const budget = ResourceBudget.create(1000, 2000, 5000, 1024);
            budget.consume(1000, 2000, 5000);
            expect(() => policy.enforce(budget)).toThrow();
        });
    });

    describe("ProviderFailoverPolicy", () => {
        it("should rotate providers", () => {
            const policy = new ProviderFailoverPolicy(["p1", "p2", "p3"]);
            expect(policy.getNextProvider("p1")).toBe("p2");
            expect(policy.getNextProvider("p3")).toBe("p1");
        });

        it("should throw for unknown provider", () => {
            const policy = new ProviderFailoverPolicy(["p1", "p2"]);
            expect(() => policy.getNextProvider("unknown")).toThrow();
        });

        it("should determine failover eligibility", () => {
            const policy = new ProviderFailoverPolicy(["p1", "p2"], 3);
            expect(policy.shouldFailover(0)).toBe(true);
            expect(policy.shouldFailover(2)).toBe(true);
            expect(policy.shouldFailover(3)).toBe(false);
        });

        it("should not failover with single provider", () => {
            const policy = new ProviderFailoverPolicy(["p1"], 3);
            expect(policy.shouldFailover(0)).toBe(false);
        });
    });

    describe("CandidateGenerationPolicy", () => {
        it("should validate dimensions", () => {
            const policy = new CandidateGenerationPolicy(ImageDimensions.create(64, 64), ImageDimensions.create(8192, 8192), 16);
            expect(policy.isValidDimension(ImageDimensions.create(512, 512))).toBe(true);
            expect(policy.isValidDimension(ImageDimensions.create(32, 32))).toBe(false);
            expect(policy.isValidDimension(ImageDimensions.create(16384, 16384))).toBe(false);
        });

        it("should enforce max candidates", () => {
            const policy = new CandidateGenerationPolicy(ImageDimensions.create(64, 64), ImageDimensions.create(8192, 8192), 8);
            expect(policy.canGenerateMore(5)).toBe(true);
            expect(policy.canGenerateMore(8)).toBe(false);
        });

        it("should return max candidates", () => {
            const policy = new CandidateGenerationPolicy(ImageDimensions.create(64, 64), ImageDimensions.create(8192, 8192), 16);
            expect(policy.getMaxCandidates()).toBe(16);
        });
    });
});
