import { describe, it, expect } from "vitest";
import { ProviderCostMetadata } from "../../../src/Domain/ValueObjects/ProviderCostMetadata";

describe("ProviderCostMetadata", () => {

    describe("free", () => {

        it("creates a free cost metadata with zero cost and USD currency", () => {
            const metadata = ProviderCostMetadata.free("provider-1");
            expect(metadata.getEstimatedCostMicros()).toBe(0);
            expect(metadata.getCurrency()).toBe("USD");
            expect(metadata.getProviderId()).toBe("provider-1");
        });

        it("reports isFree as true", () => {
            const metadata = ProviderCostMetadata.free("provider-1");
            expect(metadata.isFree()).toBe(true);
        });

    });

    describe("paid", () => {

        it("creates paid cost metadata via create", () => {
            const metadata = ProviderCostMetadata.create(500, "EUR", "provider-2");
            expect(metadata.getEstimatedCostMicros()).toBe(500);
            expect(metadata.getCurrency()).toBe("EUR");
            expect(metadata.getProviderId()).toBe("provider-2");
        });

        it("creates paid cost metadata via fromProvider", () => {
            const metadata = ProviderCostMetadata.fromProvider("provider-2", 1200);
            expect(metadata.getEstimatedCostMicros()).toBe(1200);
            expect(metadata.getCurrency()).toBe("USD");
            expect(metadata.getProviderId()).toBe("provider-2");
        });

        it("reports isFree as false", () => {
            const metadata = ProviderCostMetadata.create(500, "USD", "provider-2");
            expect(metadata.isFree()).toBe(false);
        });

    });

    describe("create", () => {

        it("trims the currency string", () => {
            const metadata = ProviderCostMetadata.create(100, "  USD  ", "provider-1");
            expect(metadata.getCurrency()).toBe("USD");
        });

        it("throws when estimatedCostMicros is negative", () => {
            expect(() => ProviderCostMetadata.create(-1, "USD", "provider-1"))
                .toThrow("ProviderCostMetadata estimatedCostMicros cannot be negative.");
        });

        it("throws when currency is empty", () => {
            expect(() => ProviderCostMetadata.create(0, "", "provider-1"))
                .toThrow("ProviderCostMetadata currency cannot be empty.");
        });

        it("throws when currency is only whitespace", () => {
            expect(() => ProviderCostMetadata.create(0, "   ", "provider-1"))
                .toThrow("ProviderCostMetadata currency cannot be empty.");
        });

    });

    describe("isFree", () => {

        it("returns true when cost is zero", () => {
            const metadata = ProviderCostMetadata.create(0, "USD", "provider-1");
            expect(metadata.isFree()).toBe(true);
        });

    });

    describe("getEstimatedCostMicros", () => {

        it("returns the stored estimated cost", () => {
            const metadata = ProviderCostMetadata.create(2500, "USD", "provider-1");
            expect(metadata.getEstimatedCostMicros()).toBe(2500);
        });

    });

    describe("getCurrency", () => {

        it("returns the stored currency", () => {
            const metadata = ProviderCostMetadata.create(100, "GBP", "provider-1");
            expect(metadata.getCurrency()).toBe("GBP");
        });

    });

    describe("getProviderId", () => {

        it("returns the stored provider id", () => {
            const metadata = ProviderCostMetadata.create(100, "USD", "my-provider");
            expect(metadata.getProviderId()).toBe("my-provider");
        });

    });

});
