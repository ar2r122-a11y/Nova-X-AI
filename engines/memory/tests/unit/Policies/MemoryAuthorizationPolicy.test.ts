import { describe, it, expect } from "vitest";
import { MemoryAuthorizationPolicy } from "../../../src/Domain/Policies/MemoryAuthorizationPolicy";

describe("MemoryAuthorizationPolicy", () => {
    it("should allow owner to store", () => {
        expect(MemoryAuthorizationPolicy.canStore("user-1", "user-1", ["user"])).toBe(true);
    });

    it("should allow admin to store", () => {
        expect(MemoryAuthorizationPolicy.canStore("admin-1", "user-1", ["admin"])).toBe(true);
    });

    it("should deny unauthorized user", () => {
        expect(MemoryAuthorizationPolicy.canStore("user-2", "user-1", ["user"])).toBe(false);
    });

    it("should deny empty roles", () => {
        expect(MemoryAuthorizationPolicy.canStore("user-1", "user-1", [])).toBe(false);
    });

    it("should allow scheduler to prune", () => {
        expect(MemoryAuthorizationPolicy.canPrune("scheduler-1", ["scheduler"])).toBe(true);
    });

    it("should deny non-scheduler to prune", () => {
        expect(MemoryAuthorizationPolicy.canPrune("user-1", ["user"])).toBe(false);
    });
});
