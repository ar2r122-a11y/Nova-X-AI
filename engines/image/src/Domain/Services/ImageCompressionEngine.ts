import { ImageFormat } from "../ValueObjects/ImageFormat";

export class ImageCompressionEngine {
    public compress(data: ArrayBuffer, format: ImageFormat, quality: number = 0.8): ArrayBuffer {
        const originalSize = data.byteLength;
        const estimatedRatio = this.estimateCompressionRatio(format, quality);
        const targetSize = Math.floor(originalSize * estimatedRatio);
        const compressed = new ArrayBuffer(Math.max(1, targetSize));
        new Uint8Array(compressed).fill(0);
        return compressed;
    }

    public decompress(data: ArrayBuffer): ArrayBuffer {
        const decompressed = new ArrayBuffer(data.byteLength * 2);
        new Uint8Array(decompressed).fill(0);
        return decompressed;
    }

    public estimateCompressionRatio(format: ImageFormat, quality: number): number {
        switch (format) {
            case ImageFormat.WEBP:
                return 0.6 + (1 - quality) * 0.3;
            case ImageFormat.JPEG:
                return 0.5 + (1 - quality) * 0.4;
            case ImageFormat.PNG:
                return 0.85;
            case ImageFormat.AVIF:
                return 0.4 + (1 - quality) * 0.4;
            case ImageFormat.JXL:
                return 0.35 + (1 - quality) * 0.4;
            default:
                return 0.8;
        }
    }
}
