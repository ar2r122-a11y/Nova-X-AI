import { describe, it, expect } from "vitest";
import { RateLimitPolicy } from "../../../src/Domain/Policies/RateLimitPolicy";
import { SafetyPolicy } from "../../../src/Domain/Policies/SafetyPolicy";
import { ContextWindowPolicy } from "../../../src/Domain/Policies/ContextWindowPolicy";
import { ConversationQuotaPolicy } from "../../../src/Domain/Policies/ConversationQuotaPolicy";
import { RetryPolicy } from "../../../src/Domain/Policies/RetryPolicy";
import { RetryStrategy } from "../../../src/Domain/ValueObjects/RetryStrategy";
import { StreamingPolicy } from "../../../src/Domain/Policies/StreamingPolicy";
import { ToolExecutionPolicy } from "../../../src/Domain/Policies/ToolExecutionPolicy";
import { ConversationRetentionPolicy } from "../../../src/Domain/Policies/ConversationRetentionPolicy";
import { MultiParticipantPolicy } from "../../../src/Domain/Policies/MultiParticipantPolicy";

describe("Policies", () => {
    it("RateLimitPolicy should allow turns within budget", () => {
        const policy = new RateLimitPolicy(2);
        expect(policy.canProceed()).toBe(true);
        policy.recordTurn();
        expect(policy.canProceed()).toBe(true);
        policy.recordTurn();
        expect(policy.canProceed()).toBe(true);
    });

    it("SafetyPolicy should sanitize script tags", () => {
        const dirty = "<script>alert('xss')</script>Hello";
        const clean = SafetyPolicy.sanitizeInput(dirty);
        expect(clean).not.toContain("<script>");
    });

    it("SafetyPolicy should detect unsafe input", () => {
        expect(SafetyPolicy.isSafe("normal text")).toBe(true);
        expect(SafetyPolicy.isSafe("<script>alert('xss')</script>")).toBe(false);
    });

    it("ContextWindowPolicy should enforce token limits", () => {
        const policy = new ContextWindowPolicy(100);
        expect(policy.canAccommodate({ getValue: () => 50 } as any)).toBe(true);
        expect(policy.canAccommodate({ getValue: () => 150 } as any)).toBe(false);
    });

    it("ConversationQuotaPolicy should track active conversations", () => {
        const policy = new ConversationQuotaPolicy(2);
        policy.incrementActive();
        policy.incrementActive();
        expect(policy.getActiveCount()).toBe(2);
        expect(() => policy.incrementActive()).toThrow();
        policy.decrementActive();
        expect(policy.getActiveCount()).toBe(1);
    });

    it("RetryPolicy should calculate delays", () => {
        const policy = new RetryPolicy(3, RetryStrategy.exponentialBackoff(), 1000);
        expect(policy.shouldRetry(0)).toBe(true);
        expect(policy.shouldRetry(3)).toBe(false);
        expect(policy.getDelayMs(0)).toBe(1000);
        expect(policy.getDelayMs(1)).toBe(2000);
    });

    it("StreamingPolicy should manage concurrent streams", () => {
        const policy = new StreamingPolicy(2, 10);
        policy.startStream();
        policy.startStream();
        expect(() => policy.startStream()).toThrow();
        policy.endStream();
        expect(() => policy.startStream()).not.toThrow();
    });

    it("ToolExecutionPolicy should enforce tool permissions", () => {
        const policy = new ToolExecutionPolicy(15_000);
        policy.registerToolPermission("admin", "dangerous_tool");
        expect(policy.isToolAllowed("admin", "dangerous_tool")).toBe(true);
        expect(policy.isToolAllowed("user", "dangerous_tool")).toBe(false);
    });

    it("ConversationRetentionPolicy should detect expired conversations", () => {
        const policy = new ConversationRetentionPolicy(1000);
        const old = Date.now() - 2000;
        const recent = Date.now();
        expect(policy.isExpired(old)).toBe(true);
        expect(policy.isExpired(recent)).toBe(false);
    });

    it("MultiParticipantPolicy should enforce participant limits", () => {
        const policy = new MultiParticipantPolicy(3);
        expect(policy.canAddParticipant(2)).toBe(true);
        expect(policy.canAddParticipant(3)).toBe(false);
    });
});
