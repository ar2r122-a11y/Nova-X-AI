export class VectorMetadata {
    private readonly vector: number[];
    private readonly dimensions: number;

    private constructor(vector: number[], dimensions: number) {
        this.vector = vector;
        this.dimensions = dimensions;
    }

    static create(vector: number[]): VectorMetadata {
        if (!Array.isArray(vector) || vector.length === 0) {
            throw new Error("Vector metadata must be a non-empty array.");
        }
        if (vector.some((v) => typeof v !== "number" || Number.isNaN(v))) {
            throw new Error("Vector metadata must contain only valid numbers.");
        }
        return new VectorMetadata(vector, vector.length);
    }

    static empty(): VectorMetadata {
        return new VectorMetadata([], 0);
    }

    getVector(): number[] {
        return this.vector;
    }

    getDimensions(): number {
        return this.dimensions;
    }

    equals(other: VectorMetadata): boolean {
        if (this.dimensions !== other.dimensions) {
            return false;
        }
        for (let i = 0; i < this.vector.length; i++) {
            if (this.vector[i] !== other.vector[i]) {
                return false;
            }
        }
        return true;
    }

    cosineSimilarity(other: VectorMetadata): number {
        if (this.dimensions !== other.dimensions || this.dimensions === 0) {
            return 0.0;
        }
        let dotProduct = 0.0;
        let normA = 0.0;
        let normB = 0.0;
        for (let i = 0; i < this.dimensions; i++) {
            dotProduct += this.vector[i] * other.vector[i];
            normA += this.vector[i] * this.vector[i];
            normB += other.vector[i] * other.vector[i];
        }
        const denom = Math.sqrt(normA) * Math.sqrt(normB);
        if (denom === 0) {
            return 0.0;
        }
        return dotProduct / denom;
    }
}
