
export class ImageDeduplicationEngine {
    private readonly fingerprints: Map<string, number> = new Map();

    public computeFingerprint(data: ArrayBuffer): string {
        const view = new Uint8Array(data);
        let hash = 0;
        for (let i = 0; i < view.length; i++) {
            hash = ((hash << 5) - hash + view[i]) | 0;
        }
        const metadata = `${hash}-${view.length}`;
        let result = 0;
        for (let i = 0; i < metadata.length; i++) {
            result = ((result << 5) - result + metadata.charCodeAt(i)) | 0;
        }
        return `img-fp-${Math.abs(result).toString(16)}-${view.length}`;
    }

    public isDuplicate(data: ArrayBuffer): boolean {
        const fingerprint = this.computeFingerprint(data);
        return this.fingerprints.has(fingerprint);
    }

    public recordFingerprint(data: ArrayBuffer): void {
        const fingerprint = this.computeFingerprint(data);
        this.fingerprints.set(fingerprint, Date.now());
    }

    public prune(maxAgeMs: number): number {
        const cutoff = Date.now() - maxAgeMs;
        let pruned = 0;
        for (const [key, timestamp] of this.fingerprints.entries()) {
            if (timestamp < cutoff) {
                this.fingerprints.delete(key);
                pruned++;
            }
        }
        return pruned;
    }
}
