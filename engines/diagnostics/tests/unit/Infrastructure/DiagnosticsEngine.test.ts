/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DiagnosticsEngine } from "../../../src/Infrastructure/DiagnosticsEngine";

describe("DiagnosticsEngine", () => {
    let eventBus: ReturnType<typeof vi.fn>;
    let engine: DiagnosticsEngine;

    const mockEventBus = {
        publish: vi.fn().mockResolvedValue(undefined),
        subscribe: vi.fn(),
        shutdown: vi.fn().mockResolvedValue(undefined)
    } as any;

    beforeEach(async () => {
        vi.clearAllMocks();
        engine = new DiagnosticsEngine(mockEventBus);
    });

    it("should initialize successfully", async () => {
        await engine.initialize();
        expect(engine["initialized"]).toBe(true);
    });

    it("should not initialize twice", async () => {
        await engine.initialize();
        await engine.initialize();
        expect(engine["initialized"]).toBe(true);
    });

    it("should shutdown cleanly", async () => {
        await engine.initialize();
        await engine.shutdown();
        expect(engine["initialized"]).toBe(false);
    });

    it("should register health probes", async () => {
        engine.registerHealthProbe({
            name: "fake-probe",
            check: async () => ({ healthy: true, durationMs: 0 })
        });
        engine.registerHealthProbe({
            name: "fake-probe-2",
            check: async () => ({ healthy: false, durationMs: 0, message: "fail" })
        });

        const budget = await engine.getDiagnosticsBudget();
        expect(budget.maxSpans).toBe(1000);
        expect(budget.profileTimeoutMs).toBe(30000);
        expect(budget.maxRetries).toBe(3);
    });

    it("should return budget with log vault usage", async () => {
        const budget = await engine.getDiagnosticsBudget();
        expect(budget.logVaultQuotaBytes).toBeGreaterThan(0);
        expect(budget.telemetryBufferBytes).toBe(16 * 1024 * 1024);
    });
});
