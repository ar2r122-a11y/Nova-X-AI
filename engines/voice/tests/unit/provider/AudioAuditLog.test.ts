import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioAuditLog } from "../../../src/Infrastructure/Provider";

describe("AudioAuditLog", () => {
    let log: AudioAuditLog;

    beforeEach(() => {
        log = new AudioAuditLog();
    });

    describe("log", () => {

        it("records an entry with the given properties", () => {
            log.log("provider-1", "start", "stream-1");
            const entries = log.getEntries();
            expect(entries.length).toBe(1);
            expect(entries[0].providerId).toBe("provider-1");
            expect(entries[0].action).toBe("start");
            expect(entries[0].streamId).toBe("stream-1");
            expect(typeof entries[0].timestamp).toBe("number");
        });

        it("appends multiple entries in order", () => {
            log.log("provider-1", "start", "stream-1");
            log.log("provider-1", "complete", "stream-1");
            log.log("provider-2", "fail", "stream-2");
            expect(log.getEntries().length).toBe(3);
        });

    });

    describe("getEntries", () => {

        it("returns a copy of the entries array", () => {
            log.log("provider-1", "start", "stream-1");
            const entries = log.getEntries();
            entries.push({ timestamp: 0, providerId: "x", action: "y", streamId: "z" });
            expect(log.getEntries().length).toBe(1);
        });

        it("returns an empty array when no entries have been logged", () => {
            expect(log.getEntries()).toEqual([]);
        });

    });

    describe("clear", () => {

        it("removes all log entries", () => {
            log.log("provider-1", "start", "stream-1");
            log.log("provider-1", "complete", "stream-1");
            log.clear();
            expect(log.getEntries()).toEqual([]);
        });

    });

});
