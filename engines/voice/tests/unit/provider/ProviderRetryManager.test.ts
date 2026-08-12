import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProviderRetryManager } from "../../../src/Infrastructure/Provider";

describe("ProviderRetryManager", () => {
    let manager: ProviderRetryManager;

    beforeEach(() => {
        manager = new ProviderRetryManager();
    });

    describe("increment", () => {

        it("returns 1 on first increment", () => {
            expect(manager.increment("stream-1")).toBe(1);
        });

        it("increments the retry count on subsequent calls", () => {
            manager.increment("stream-1");
            manager.increment("stream-1");
            expect(manager.increment("stream-1")).toBe(3);
        });

        it("tracks retries independently per streamId", () => {
            manager.increment("stream-a");
            manager.increment("stream-b");
            manager.increment("stream-a");
            expect(manager.getCount("stream-a")).toBe(2);
            expect(manager.getCount("stream-b")).toBe(1);
        });

    });

    describe("getCount", () => {

        it("returns 0 for a streamId with no retries", () => {
            expect(manager.getCount("stream-1")).toBe(0);
        });

        it("returns the current retry count", () => {
            manager.increment("stream-1");
            manager.increment("stream-1");
            expect(manager.getCount("stream-1")).toBe(2);
        });

    });

    describe("reset", () => {

        it("resets the retry count to 0 for a streamId", () => {
            manager.increment("stream-1");
            manager.increment("stream-1");
            manager.reset("stream-1");
            expect(manager.getCount("stream-1")).toBe(0);
        });

    });

    describe("clear", () => {

        it("removes all retry counts", () => {
            manager.increment("stream-1");
            manager.increment("stream-2");
            manager.clear();
            expect(manager.getCount("stream-1")).toBe(0);
            expect(manager.getCount("stream-2")).toBe(0);
        });

    });

});
