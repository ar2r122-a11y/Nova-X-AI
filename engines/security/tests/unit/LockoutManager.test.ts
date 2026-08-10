import { describe, it, expect, vi } from "vitest";
import { LockoutManager } from "../../src/Infrastructure/Lockout/LockoutManager";
import { LockoutReason } from "../../src/Domain/ValueObjects";

describe("LockoutManager", () => {
    it("should lockout after max retries", async () => {
        const lockoutSpy = vi.fn();
        const manager = new LockoutManager();
        manager.setSecurity({
            lockoutIdentity: lockoutSpy,
            getSessions: () => [],
            getAggregate: () => ({ setState: () => {}, registerSession: () => {}, lockSession: () => ({}) })
        } as any);

        await manager.checkAndLockout("id-1", 5);
        expect(lockoutSpy).toHaveBeenCalledWith("id-1", "max_retries_exceeded");
    });

    it("should not lockout before max retries", async () => {
        const lockoutSpy = vi.fn();
        const manager = new LockoutManager();
        manager.setSecurity({
            lockoutIdentity: lockoutSpy,
            getSessions: () => [],
            getAggregate: () => ({ setState: () => {}, registerSession: () => {}, lockSession: () => ({}) })
        } as any);

        const result = await manager.checkAndLockout("id-1", 2);
        expect(result).toBe(false);
        expect(lockoutSpy).not.toHaveBeenCalled();
    });

    it("should lockout with custom reason", async () => {
        const lockoutSpy = vi.fn();
        const manager = new LockoutManager();
        manager.setSecurity({
            lockoutIdentity: lockoutSpy,
            getSessions: () => [],
            getAggregate: () => ({ setState: () => {}, registerSession: () => {}, lockSession: () => ({}) })
        } as any);

        await manager.lockout("id-1", LockoutReason.tamperDetected());
        expect(lockoutSpy).toHaveBeenCalledWith("id-1", "tamper_detected");
    });
});
