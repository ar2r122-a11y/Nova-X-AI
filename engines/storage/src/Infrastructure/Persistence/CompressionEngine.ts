import { ICompressionEngine } from "../../Contracts";

export class CompressionEngine implements ICompressionEngine {
    async compress(data: ArrayBuffer): Promise<{ data: ArrayBuffer; algorithm: string }> {
        const text = new TextDecoder().decode(data);
        const compressed = btoa(unescape(encodeURIComponent(text)));
        const buffer = new TextEncoder().encode(compressed).buffer;
        return { data: buffer, algorithm: "base64" };
    }

    async decompress(data: ArrayBuffer, algorithm: string): Promise<ArrayBuffer> {
        if (algorithm !== "base64") {
            throw new Error(`Unsupported compression algorithm: ${algorithm}`);
        }
        const text = new TextDecoder().decode(data);
        const decompressed = decodeURIComponent(escape(atob(text)));
        return new TextEncoder().encode(decompressed).buffer;
    }

    async estimateCompressionRatio(data: ArrayBuffer): Promise<number> {
        const result = await this.compress(data);
        return result.data.byteLength / data.byteLength;
    }
}
