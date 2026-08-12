import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioRingBuffer } from "../../../src/Infrastructure/Streaming";

describe("AudioRingBuffer", () => {
    let buffer: AudioRingBuffer;

    beforeEach(() => {
        buffer = new AudioRingBuffer(64);
    });

    describe("write", () => {

        it("writes data and returns true", () => {
            const data = new Uint8Array([1, 2, 3, 4]);
            expect(buffer.write(data)).toBe(true);
        });

        it("returns false when buffer is full", () => {
            buffer.write(new Uint8Array(64));
            expect(buffer.write(new Uint8Array(1))).toBe(false);
        });

        it("wraps around on overflow", () => {
            buffer.write(new Uint8Array(32));
            buffer.read(32);
            buffer.write(new Uint8Array(32));
            expect(buffer.available()).toBe(32);
        });

    });

    describe("read", () => {

        it("reads data back", () => {
            const data = new Uint8Array([1, 2, 3, 4]);
            buffer.write(data);
            const result = buffer.read(4);
            expect(result).toEqual(new Uint8Array([1, 2, 3, 4]));
        });

        it("returns empty array when buffer is empty", () => {
            const result = buffer.read(10);
            expect(result.length).toBe(0);
        });

        it("reads up to available data when length exceeds available", () => {
            buffer.write(new Uint8Array([1, 2, 3]));
            const result = buffer.read(10);
            expect(result.length).toBe(3);
        });

        it("updates available after read", () => {
            buffer.write(new Uint8Array([1, 2, 3, 4]));
            buffer.read(2);
            expect(buffer.available()).toBe(2);
        });

    });

    describe("clear", () => {

        it("resets buffer state", () => {
            buffer.write(new Uint8Array([1, 2, 3]));
            buffer.clear();
            expect(buffer.available()).toBe(0);
            expect(buffer.remaining()).toBe(64);
        });

    });

    describe("available", () => {

        it("returns 0 for an empty buffer", () => {
            expect(buffer.available()).toBe(0);
        });

        it("returns the number of filled bytes", () => {
            buffer.write(new Uint8Array([1, 2, 3]));
            expect(buffer.available()).toBe(3);
        });

    });

    describe("remaining", () => {

        it("returns capacity when empty", () => {
            expect(buffer.remaining()).toBe(64);
        });

        it("returns capacity minus filled bytes", () => {
            buffer.write(new Uint8Array([1, 2, 3]));
            expect(buffer.remaining()).toBe(61);
        });

    });

    describe("overflow behavior", () => {

        it("rejects writes that exceed remaining capacity", () => {
            buffer.write(new Uint8Array(32));
            expect(buffer.write(new Uint8Array(33))).toBe(false);
        });

        it("preserves data across wrap-around writes", () => {
            buffer.write(new Uint8Array(32));
            buffer.read(32);
            buffer.write(new Uint8Array([1, 2, 3]));
            const result = buffer.read(3);
            expect(result).toEqual(new Uint8Array([1, 2, 3]));
        });

    });

});
