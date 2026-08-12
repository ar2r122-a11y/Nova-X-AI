import { describe, it, expect } from "vitest";
import { AudioCodec } from "../../../src/Domain/ValueObjects/AudioCodec";

describe("AudioCodec", () => {

    describe("pcm", () => {

        it("returns a pcm codec", () => {
            const codec = AudioCodec.pcm();
            expect(codec.getValue()).toBe("pcm");
        });

    });

    describe("opus", () => {

        it("returns an opus codec", () => {
            const codec = AudioCodec.opus();
            expect(codec.getValue()).toBe("opus");
        });

    });

    describe("aac", () => {

        it("returns an aac codec", () => {
            const codec = AudioCodec.aac();
            expect(codec.getValue()).toBe("aac");
        });

    });

    describe("create", () => {

        it("normalizes the codec string to lowercase", () => {
            const codec = AudioCodec.create("PCM");
            expect(codec.getValue()).toBe("pcm");
        });

        it("throws for an unsupported codec", () => {
            expect(() => AudioCodec.create("mp3")).toThrow("Invalid AudioCodec: mp3");
        });

    });

    describe("getValue", () => {

        it("returns the stored codec value", () => {
            const codec = AudioCodec.create("opus");
            expect(codec.getValue()).toBe("opus");
        });

    });

});
