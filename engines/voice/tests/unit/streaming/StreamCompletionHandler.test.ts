import { describe, it, expect, vi, beforeEach } from "vitest";
import { StreamCompletionHandler } from "../../../src/Infrastructure/Streaming";

describe("StreamCompletionHandler", () => {
    let handler: StreamCompletionHandler;

    beforeEach(() => {
        handler = new StreamCompletionHandler();
    });

    describe("complete", () => {

        it("resolves without error", async () => {
            await expect(handler.complete("stream-1")).resolves.toBeUndefined();
        });

    });

    describe("fail", () => {

        it("resolves without error", async () => {
            await expect(handler.fail("stream-1", "timeout")).resolves.toBeUndefined();
        });

    });

});
