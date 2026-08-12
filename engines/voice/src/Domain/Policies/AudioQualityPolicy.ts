export class AudioQualityPolicy {
    static readonly MIN_SAMPLE_RATE = 16000;
    static readonly MAX_SAMPLE_RATE = 48000;
    static readonly MIN_BIT_DEPTH = 16;
    static readonly MAX_BIT_DEPTH = 32;
    static readonly MAX_BITRATE_KBPS = 128;
    static readonly MAX_RING_BUFFER_BYTES = 64 * 1024 * 1024;

    static validateSampleRate(sampleRate: number): boolean {
        return sampleRate >= AudioQualityPolicy.MIN_SAMPLE_RATE && sampleRate <= AudioQualityPolicy.MAX_SAMPLE_RATE;
    }

    static validateBitDepth(bitDepth: number): boolean {
        return bitDepth >= AudioQualityPolicy.MIN_BIT_DEPTH && bitDepth <= AudioQualityPolicy.MAX_BIT_DEPTH;
    }

    static validateBitrate(bitrateKbps: number): boolean {
        return bitrateKbps <= AudioQualityPolicy.MAX_BITRATE_KBPS;
    }

    static validateRingBuffer(sizeBytes: number): boolean {
        return sizeBytes <= AudioQualityPolicy.MAX_RING_BUFFER_BYTES;
    }
}
