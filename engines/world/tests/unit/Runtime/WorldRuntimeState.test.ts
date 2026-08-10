/// <reference types="vitest" />
import { describe, it, expect } from "vitest";
import { isValidRuntimeTransition } from "../../../src/Contracts/Runtime/WorldRuntimeState";

describe("WorldRuntimeState", () => {
    describe("isValidRuntimeTransition", () => {
        it("should allow initialized -> active", () => {
            expect(isValidRuntimeTransition("initialized", "active")).toBe(true);
        });

        it("should allow initialized -> failed", () => {
            expect(isValidRuntimeTransition("initialized", "failed")).toBe(true);
        });

        it("should deny initialized -> archived", () => {
            expect(isValidRuntimeTransition("initialized", "archived")).toBe(false);
        });

        it("should allow active -> simulation_running", () => {
            expect(isValidRuntimeTransition("active", "simulation_running")).toBe(true);
        });

        it("should allow active -> failed", () => {
            expect(isValidRuntimeTransition("active", "failed")).toBe(true);
        });

        it("should allow simulation_running -> time_paused", () => {
            expect(isValidRuntimeTransition("simulation_running", "time_paused")).toBe(true);
        });

        it("should allow simulation_running -> environmental_shift", () => {
            expect(isValidRuntimeTransition("simulation_running", "environmental_shift")).toBe(true);
        });

        it("should allow simulation_running -> archived", () => {
            expect(isValidRuntimeTransition("simulation_running", "archived")).toBe(true);
        });

        it("should allow simulation_running -> failed", () => {
            expect(isValidRuntimeTransition("simulation_running", "failed")).toBe(true);
        });

        it("should allow time_paused -> simulation_running", () => {
            expect(isValidRuntimeTransition("time_paused", "simulation_running")).toBe(true);
        });

        it("should allow time_paused -> failed", () => {
            expect(isValidRuntimeTransition("time_paused", "failed")).toBe(true);
        });

        it("should allow environmental_shift -> simulation_running", () => {
            expect(isValidRuntimeTransition("environmental_shift", "simulation_running")).toBe(true);
        });

        it("should allow failed -> recovering", () => {
            expect(isValidRuntimeTransition("failed", "recovering")).toBe(true);
        });

        it("should allow failed -> archived", () => {
            expect(isValidRuntimeTransition("failed", "archived")).toBe(true);
        });

        it("should allow recovering -> active", () => {
            expect(isValidRuntimeTransition("recovering", "active")).toBe(true);
        });

        it("should allow recovering -> failed", () => {
            expect(isValidRuntimeTransition("recovering", "failed")).toBe(true);
        });

        it("should deny archived -> any state", () => {
            expect(isValidRuntimeTransition("archived", "active")).toBe(false);
            expect(isValidRuntimeTransition("archived", "failed")).toBe(false);
            expect(isValidRuntimeTransition("archived", "recovering")).toBe(false);
        });

    it("should be deterministic for invalid transitions", () => {
        expect(isValidRuntimeTransition("active", "environmental_shift")).toBe(false);
        expect(isValidRuntimeTransition("time_paused", "environmental_shift")).toBe(false);
        expect(isValidRuntimeTransition("recovering", "simulation_running")).toBe(false);
    });
    });
});
