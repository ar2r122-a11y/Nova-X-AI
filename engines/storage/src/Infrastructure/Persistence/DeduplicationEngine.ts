import { IDeduplicationEngine } from "../../Contracts";

export class DeduplicationEngine implements IDeduplicationEngine {
    private readonly fingerprints = new Map<string, number>();

    async computeFingerprint(data: ArrayBuffer): Promise<string> {
        const hash = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hash));
        return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }

    async isDuplicate(fingerprint: string): Promise<boolean> {
        return this.fingerprints.has(fingerprint);
    }

    async recordFingerprint(fingerprint: string): Promise<void> {
        this.fingerprints.set(fingerprint, Date.now());
    }

    async prune(olderThanMs: number): Promise<number> {
        const cutoff = Date.now() - olderThanMs;
        let pruned = 0;
        for (const [fingerprint, timestamp] of this.fingerprints) {
            if (timestamp < cutoff) {
                this.fingerprints.delete(fingerprint);
                pruned++;
            }
        }
        return pruned;
    }
}
