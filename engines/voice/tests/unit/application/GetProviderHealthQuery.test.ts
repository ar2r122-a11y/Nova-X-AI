import { describe, it, expect } from "vitest";
import { GetProviderHealthQuery } from "../../../src/Application/Queries/GetProviderHealthQuery";

describe("GetProviderHealthQuery", () => {
    it("creates with required providerId", () => {
        const query = new GetProviderHealthQuery("provider-1");
        expect(query.providerId).toBe("provider-1");
    });

    it("has undefined requesterId by default", () => {
        const query = new GetProviderHealthQuery("provider-1");
        expect(query.requesterId).toBeUndefined();
    });

    it("accepts optional requesterId", () => {
        const query = new GetProviderHealthQuery("provider-1", "user-1");
        expect(query.requesterId).toBe("user-1");
    });

    it("implements IQuery", () => {
        const query = new GetProviderHealthQuery("provider-1");
        expect(typeof query).toBe("object");
        expect("providerId" in query).toBe(true);
        expect("requesterId" in query).toBe(true);
    });
});
