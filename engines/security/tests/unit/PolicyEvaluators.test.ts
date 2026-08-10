import { describe, it, expect } from "vitest";
import { RBACPolicyEvaluator } from "../../src/Infrastructure/Policies/RBACPolicyEvaluator";
import { ABACPolicyEvaluator } from "../../src/Infrastructure/Policies/ABACPolicyEvaluator";
import { SecurityPolicy } from "../../src/Domain/Entities";

describe("RBACPolicyEvaluator", () => {
    it("should allow matching policy", () => {
        const evaluator = new RBACPolicyEvaluator();
        evaluator.addPolicy({
            policyId: "pol-1",
            name: "allow-read",
            effect: "allow",
            resource: "data",
            action: "read",
            conditions: { role: "user" },
            priority: 100,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        const result = evaluator.evaluate("id-1", "data", "read", { roles: ["user"] });
        expect(result.allowed).toBe(true);
        expect(result.matchedPolicy).toBe("pol-1");
    });

    it("should deny non-matching role", () => {
        const evaluator = new RBACPolicyEvaluator();
        evaluator.addPolicy({
            policyId: "pol-1",
            name: "allow-read",
            effect: "allow",
            resource: "data",
            action: "read",
            conditions: { role: "admin" },
            priority: 100,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        const result = evaluator.evaluate("id-1", "data", "read", { roles: ["user"] });
        expect(result.allowed).toBe(false);
        expect(result.reason).toBe("no_matching_policy");
    });

    it("should deny by explicit deny policy", () => {
        const evaluator = new RBACPolicyEvaluator();
        evaluator.addPolicy({
            policyId: "pol-1",
            name: "deny-read",
            effect: "deny",
            resource: "data",
            action: "read",
            conditions: { role: "user" },
            priority: 100,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        const result = evaluator.evaluate("id-1", "data", "read", { roles: ["user"] });
        expect(result.allowed).toBe(false);
        expect(result.reason).toBe("denied_by_policy");
    });
});

describe("ABACPolicyEvaluator", () => {
    it("should allow matching policy with conditions", () => {
        const evaluator = new ABACPolicyEvaluator();
        evaluator.addPolicy({
            policyId: "pol-1",
            name: "allow-read",
            effect: "allow",
            resource: "data",
            action: "read",
            conditions: { role: "user", clearanceLevel: 1 },
            priority: 100,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        const result = evaluator.evaluate("id-1", "data", "read", { roles: ["user"], clearanceLevel: 2 });
        expect(result.allowed).toBe(true);
    });

    it("should deny when clearance level is too low", () => {
        const evaluator = new ABACPolicyEvaluator();
        evaluator.addPolicy({
            policyId: "pol-1",
            name: "allow-read",
            effect: "allow",
            resource: "data",
            action: "read",
            conditions: { role: "user", clearanceLevel: 3 },
            priority: 100,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        const result = evaluator.evaluate("id-1", "data", "read", { roles: ["user"], clearanceLevel: 1 });
        expect(result.allowed).toBe(false);
    });

    it("should allow wildcard resource", () => {
        const evaluator = new ABACPolicyEvaluator();
        evaluator.addPolicy({
            policyId: "pol-1",
            name: "allow-all",
            effect: "allow",
            resource: "*",
            action: "read",
            conditions: {},
            priority: 100,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        const result = evaluator.evaluate("id-1", "anything", "read");
        expect(result.allowed).toBe(true);
    });
});
